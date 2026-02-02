console.log('campaign module loaded');

export const campaign = {
  data() {
    return {
      parent: null,
      loader: 0,
      campaignId: null,
      items: []
    };
  },

  mounted() {
    this.parent = this.$root;
    this.campaignId = this.$route.params.id;

    if (!this.parent.user) {
      this.parent.logout();
      return;
    }

    this.getCampaign();
  },

  methods: {
    getCampaign() {
      this.loader = 1;

      const fd = new FormData();
      fd.append('id', this.campaignId);

      axios.post(
        this.parent.url + '/site/getCampaign?auth=' + this.parent.user.auth.data,
        fd
      )
      .then(res => {
        this.items = Array.isArray(res.data.items)
          ? res.data.items.filter(i => i && i.id)
          : [];
      })
      .finally(() => {
        this.loader = 0;
      });
    },

    togglePublished(item, value) {
      const old = item.published;
      item.published = value;

      axios.post(
        this.parent.url + '/site/actionCampaignItem?auth=' + this.parent.user.auth.data,
        this.parent.toFormData(item)
      ).catch(() => {
        item.published = old;
      });
    },

    remove(item) {
      this.parent.formData = { ...item };

      this.$refs.header.$refs.msg.confirmFun(
        'Confirm',
        'Delete this item?'
      ).then(ok => {
        if (!ok) return;

        axios.post(
          this.parent.url + '/site/actionCampaignItem?auth=' + this.parent.user.auth.data,
          this.parent.toFormData(item)
        ).then(() => {
          this.getCampaign();
        });
      });
    }
  },

  template: `
  <div class="inside-content">

    <Header ref="header" />

    <div id="spinner" v-if="loader"></div>

    <div class="wrapper">

      <h1>Campaign #{{ campaignId }}</h1>

      <div class="table" v-if="items.length">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Size</th>
              <th>Link</th>
              <th>Views</th>
              <th>Clicks</th>
              <th>Leads</th>
              <th>Fraud</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in items" :key="'item-' + item.id">

              <td>{{ i + 1 }}</td>

              <td>
                <img
                  v-if="item.image"
                  :src="item.image"
                  style="max-width:80px"
                />
              </td>

              <td>{{ item.width }}×{{ item.height }}</td>

              <td>
                <a :href="item.link" target="_blank">
                  {{ item.link }}
                </a>
              </td>

              <td>{{ item.views || 0 }}</td>
              <td>{{ item.clicks || 0 }}</td>
              <td>{{ item.leads || 0 }}</td>
              <td>{{ item.fclicks || 0 }}</td>

              <td class="actions">
                <toogle
                  :modelValue="item.published"
                  @update:modelValue="togglePublished(item, $event)"
                />

                <a href="#" @click.prevent="remove(item)">
                  <i class="fas fa-trash-alt"></i>
                </a>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty" v-else>
        No items
      </div>

    </div>
  </div>
  `
};
