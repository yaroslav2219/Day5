export const campaign = {
  data() {
    return {
      parent: null,
      loader: false,
      ads: [],
      campaignTitle: ''
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent.user) {
      this.parent.logout();
      return;
    }

    this.getAds();
  },

  methods: {
    getAds() {
      this.loader = true;

      axios.post(
        this.parent.url + '/site/getCampaignAds?auth=' + this.parent.user.auth.data,
        this.parent.toFormData({
          campaign: this.$route.params.id
        })
      ).then(res => {
        this.ads = Array.isArray(res.data.items) ? res.data.items : [];
        this.campaignTitle = res.data.title || '';
        this.loader = false;
      }).catch(() => {
        this.parent.logout();
      });
    },

    togglePublished(item, value) {
      item.published = value;

      axios.post(
        this.parent.url + '/site/actionBanner?auth=' + this.parent.user.auth.data,
        this.parent.toFormData(item)
      ).catch(() => {
        item.published = !value;
      });
    },

    remove(item) {
      if (!confirm('Delete ad?')) return;

      axios.post(
        this.parent.url + '/site/actionBanner?auth=' + this.parent.user.auth.data,
        this.parent.toFormData(item)
      ).then(() => {
        this.getAds();
      });
    }
  },

  template: `
  <div class="inside-content">
    <Header />

    <div class="wrapper">
      <!-- HEADER -->
      <div class="flex panel">
        <div class="w50">
          <h1>{{ campaignTitle }}</h1>
        </div>

        <div class="w50 ar">
          <a href="#" class="btn" @click.prevent="parent.formData={};">
            Edit campaign
          </a>
          <a href="#" class="btn green" style="margin-left:10px">
            New +
          </a>
        </div>
      </div>

      <!-- LOADER -->
      <div v-if="loader">Loading...</div>

      <!-- ADS TABLE -->
      <div class="table" v-if="ads.length">
        <table>
          <thead>
            <tr>
              <th class="actions">Actions</th>
              <th class="id">Fraud<br>clicks</th>
              <th class="id">Leads</th>
              <th class="id">Clicks</th>
              <th class="id">Views</th>
              <th>Link</th>
              <th class="id">Size</th>
              <th class="image">Image</th>
              <th class="id">#</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="ad in ads" :key="ad.id">
              <td class="actions">
                ✏️
                &nbsp;
                <a href="#" @click.prevent="remove(ad)">🗑</a>
              </td>

              <td class="id">{{ ad.fclicks || 0 }}</td>
              <td class="id">{{ ad.leads || 0 }}</td>
              <td class="id">{{ ad.clicks || 0 }}</td>
              <td class="id">{{ ad.views || 0 }}</td>

              <td>
                <a :href="ad.link" target="_blank">
                  {{ ad.link }}
                </a>
              </td>

              <td class="id">
                {{ ad.width }}x{{ ad.height }}
              </td>

              <td class="image">
                <img
                  :src="ad.image"
                  style="max-width:60px;max-height:60px"
                >
              </td>

              <td class="id">
                <toogle
                  :modelValue="ad.published"
                  @update:modelValue="togglePublished(ad, $event)"
                />
                {{ ad.id }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty" v-else>
        No ads
      </div>
    </div>
  </div>
  `
};
