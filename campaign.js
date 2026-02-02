export const campaign = {
  data() {
    return {
      parent: null,
      loader: false,
      items: []
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent.user) {
      this.parent.logout();
      return;
    }

    this.get();
  },

  methods: {
    get() {
      this.loader = true;

      axios.post(
        this.parent.url + '/site/getCampaigns?auth=' + this.parent.user.auth.data
      ).then(res => {
        this.items = Array.isArray(res.data.items)
          ? res.data.items
          : [];
        this.loader = false;
      }).catch(() => {
        this.parent.logout();
      });
    },

    togglePublished(item, value) {
      item.published = value;

      const fd = this.parent.toFormData(item);

      axios.post(
        this.parent.url + '/site/actionCampaign?auth=' + this.parent.user.auth.data,
        fd
      ).catch(() => {
        item.published = !value;
      });
    },

    remove(item) {
      this.parent.formData = item;

      if (!confirm('Delete campaign?')) return;

      axios.post(
        this.parent.url + '/site/actionCampaign?auth=' + this.parent.user.auth.data,
        this.parent.toFormData(item)
      ).then(() => {
        this.get();
      });
    }
  },

  template: `
  <div class="inside-content">
    <Header />

    <div class="wrapper">
      <div class="flex panel">
        <div class="w50">
          <h1>Campaigns</h1>
        </div>

        <div class="w50 ar">
          <a href="#" class="btn" @click.prevent="parent.formData={};">
            + New
          </a>
        </div>
      </div>

      <div v-if="loader">Loading...</div>

      <div class="table" v-if="items.length">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Title</th>
              <th>Views</th>
              <th>Clicks</th>
              <th>Leads</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>

              <td>
                <toogle
                  :modelValue="item.published"
                  @update:modelValue="togglePublished(item, $event)"
                />
              </td>

              <td>
                <router-link :to="'/campaign/' + item.id">
                  {{ item.title }}
                </router-link>
              </td>

              <td>{{ item.views || 0 }}</td>
              <td>{{ item.clicks || 0 }}</td>
              <td>{{ item.leads || 0 }}</td>

              <td>
                <router-link :to="'/campaign/' + item.id">
                  ✏️
                </router-link>
                &nbsp;
                <a href="#" @click.prevent="remove(item)">
                  🗑
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else>
        No campaigns
      </div>
    </div>
  </div>
  `
};
