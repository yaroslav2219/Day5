console.log('campaign module loaded');

export const campaign = {
  name: 'Campaign',

  data() {
    return {
      parent: null,

      loader: false,

      items: [],

      date: '',
      date2: '',

      iChart: -1,
      chart: null,
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent?.user) {
      this.parent.logout();
      return;
    }

    this.setDates();
    this.getCampaigns();
  },

  methods: {
    /* ===================== */
    /* DATES */
    /* ===================== */
    setDates() {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();

      this.date  = new Date(y, m, 1).toISOString().slice(0, 10);
      this.date2 = new Date(y, m + 1, 0).toISOString().slice(0, 10);
    },

    /* ===================== */
    /* API */
    /* ===================== */
    getCampaigns() {
      this.loader = true;

      axios
        .post(
          this.parent.url +
            '/site/getCampaigns?auth=' +
            this.parent.user.auth.data
        )
        .then(res => {
          this.items = Array.isArray(res.data.items)
            ? res.data.items.filter(i => i && i.id)
            : [];
        })
        .catch(() => this.parent.logout())
        .finally(() => (this.loader = false));
    },

    togglePublished(item, value) {
      const old = item.published;
      item.published = value;

      axios
        .post(
          this.parent.url +
            '/site/actionCampaign?auth=' +
            this.parent.user.auth.data,
          this.parent.toFormData(item)
        )
        .catch(() => {
          item.published = old;
        });
    },

    /* ===================== */
    /* CRUD */
    /* ===================== */
    save() {
      if (!this.parent.formData?.title) return;

      axios
        .post(
          this.parent.url +
            '/site/actionCampaign?auth=' +
            this.parent.user.auth.data,
          this.parent.toFormData(this.parent.formData)
        )
        .then(() => {
          this.$refs.new.active = false;
          this.getCampaigns();
        });
    },

    async remove(item) {
      if (
        !(await this.$refs.header.$refs.msg.confirmFun(
          'Confirm',
          'Delete campaign?'
        ))
      )
        return;

      this.parent.formData = { ...item };

      axios
        .post(
          this.parent.url +
            '/site/actionCampaign?auth=' +
            this.parent.user.auth.data,
          this.parent.toFormData(this.parent.formData)
        )
        .then(() => this.getCampaigns());
    },

    /* ===================== */
    /* CHART */
    /* ===================== */
    openChart(item, index) {
      this.iChart = index;
      this.$refs.chart.active = true;

      this.$nextTick(() => this.renderChart(item));
    },

    renderChart(item) {
      if (!item?.line) return;

      const labels = [];
      const clicks = [];
      const views = [];

      Object.keys(item.line).forEach(d => {
        labels.push(d);
        clicks.push(item.line[d].clicks || 0);
        views.push(item.line[d].views || 0);
      });

      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById('myChart');
      if (!ctx) return;

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Clicks',
              data: clicks,
            },
            {
              label: 'Views',
              data: views,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    },
  },

  template: `
<div class="inside-content">
  <Header ref="header" />

  <div v-if="loader" id="spinner"></div>

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
        <tr v-for="(item,i) in items" :key="item.id">
          <td>{{ item.id }}</td>

          <td>
            <toogle
              :modelValue="item.published"
              @update:modelValue="togglePublished(item,$event)"
            />
          </td>

          <td>
            <router-link :to="'/campaign/' + item.id">
              {{ item.title }}
            </router-link>
          </td>

          <td>{{ item.views }}</td>
          <td>{{ item.clicks || 0 }}</td>
          <td>{{ item.leads || 0 }}</td>

          <td class="actions">
            <a href="#" @click.prevent="openChart(item,i)">
              📊
            </a>
            <a href="#" @click.prevent="remove(item)">
              🗑
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="empty">
    No campaigns
  </div>

  <popup ref="chart" fullscreen title="Statistics">
    <canvas id="myChart"></canvas>
  </popup>

  <popup ref="new" title="Campaign">
    <form @submit.prevent="save">
      <input v-model="parent.formData.title" placeholder="Title" required />
      <button class="btn">Save</button>
    </form>
  </popup>
</div>
`,
};
