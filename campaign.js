export const campaign = {
  data() {
    return {
      parent: null,
      loader: false,
      items: [],
      form: {
        link: '',
        description: '',
        type: '',
        image: null
      }
    }
  },

  mounted() {
    this.parent = this.$root

    if (!this.parent?.user?.auth?.data) {
      this.parent.logout()
      return
    }

    this.get()
  },

  methods: {
    get() {
      // тимчасові дані
      this.items = [
        {
          id: 1,
          image: 'https://via.placeholder.com/300x250',
          type: '300x250',
          link: 'https://dreamview-seo.co-il',
          views: 120,
          clicks: 15,
          leads: 3,
          fclicks: 0
        }
      ]
    },

    openNew() {
      this.form = {
        link: '',
        description: '',
        type: '',
        image: null
      }
      this.$refs.new.active = 1
    },

    onImageChange(e) {
      this.form.image = e.target.files[0] || null
    },

    save() {
      if (!this.form.link || !this.form.type || !this.form.image) return

      const data = new FormData()
      data.append('campaign', this.$route.params.id)
      data.append('link', this.form.link)
      data.append('description', this.form.description)
      data.append('type', this.form.type)
      data.append('image', this.form.image)

      axios.post(
        this.parent.url + '/site/actionBanner?auth=' + this.parent.user.id,
        data
      ).then(() => {
        this.$refs.new.active = 0
        this.get()
      })
    },

    del(item) {
      if (!confirm('Delete banner?')) return

      axios.post(
        this.parent.url + '/site/actionBanner?auth=' + this.parent.user.id,
        this.parent.toFormData({
          id: item.id,
          delete: 1
        })
      ).then(() => {
        this.get()
      })
    }
  },

  template: `
  <div class="inside-content">

    <Header />

    <div v-if="loader" id="spinner"></div>

    <div class="panel flex">
      <h1 class="w50">Campaign</h1>
      <div class="w50 ar">
        <a href="#" class="btnS" @click.prevent="openNew">
          <i class="fas fa-plus"></i> New
        </a>
      </div>
    </div>

    <div class="table" v-if="items.length">
      <table>
        <thead>
          <tr>
            <th class="id">#</th>
            <th>Image</th>
            <th>Size</th>
            <th>Link</th>
            <th class="id">Views</th>
            <th class="id">Clicks</th>
            <th class="id">Leads</th>
            <th class="id">Fraud</th>
            <th class="actions"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="id">{{ item.id }}</td>
            <td><img :src="item.image" style="max-height:60px"></td>
            <td>{{ item.type }}</td>
            <td>{{ item.link }}</td>
            <td class="id">{{ item.views || 0 }}</td>
            <td class="id">{{ item.clicks || 0 }}</td>
            <td class="id">{{ item.leads || 0 }}</td>
            <td class="id">{{ item.fclicks || 0 }}</td>
            <td class="actions">
              <a href="#" @click.prevent="del(item)">
                <i class="fas fa-trash-alt"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No items</div>

    <popup ref="new" title="New banner">
      <div class="form inner-form">
        <form @submit.prevent="save">
          <div class="row">
            <label>Link</label>
            <input type="url" v-model="form.link" required>
          </div>

          <div class="row">
            <label>Description</label>
            <input type="text" v-model="form.description">
          </div>

          <div class="row">
            <label>Size</label>
            <select v-model="form.type" required>
              <option value="">— Select —</option>
              <option value="300x250">300x250</option>
              <option value="728x90">728x90</option>
              <option value="160x600">160x600</option>
            </select>
          </div>

          <div class="row">
            <label>Image</label>
            <input type="file" accept="image/*" @change="onImageChange" required>
          </div>

          <div class="row">
            <button class="btn">Save</button>
          </div>
        </form>
      </div>
    </popup>

  </div>
  `
}

