export const campaign = {
    template: `
        <div>
            <h2>{{ campaign.title }}</h2>

            <button @click="addRow">New +</button>

            <table border="1" width="100%" style="margin-top:10px">
                <tr>
                    <th>Actions</th>
                    <th>Fraud</th>
                    <th>Leads</th>
                    <th>Clicks</th>
                    <th>Views</th>
                    <th>Link</th>
                    <th>Size</th>
                    <th>Image</th>
                    <th>#</th>
                </tr>

                <tr v-for="(row, i) in rows" :key="row.id">
                    <td>
                        <button @click="remove(i)">🗑</button>
                    </td>
                    <td>{{ row.fraud }}</td>
                    <td>{{ row.leads }}</td>
                    <td>{{ row.clicks }}</td>
                    <td>{{ row.views }}</td>
                    <td>
                        <a :href="row.link" target="_blank">{{ row.link }}</a>
                    </td>
                    <td>{{ row.size }}</td>
                    <td>
                        <img :src="row.image" width="60">
                    </td>
                    <td>{{ row.id }}</td>
                </tr>
            </table>
        </div>
    `,
    data() {
        return {
            campaign: {
                id: null,
                title: ''
            },
            rows: []
        }
    },
    mounted() {
        const id = this.$route.params.id

        this.campaign = {
            id,
            title: 'dreamview-seo'
        }

        this.rows = [
            {
                id: 6,
                fraud: 0,
                leads: 0,
                clicks: 0,
                views: 0,
                link: 'https://dreamview-seo.co.il',
                size: '320x320',
                image: 'https://via.placeholder.com/150'
            }
        ]
    },
    methods: {
        addRow() {
            this.rows.push({
                id: Date.now(),
                fraud: 0,
                leads: 0,
                clicks: 0,
                views: 0,
                link: 'https://dreamview-seo.co.il',
                size: '300x300',
                image: 'https://via.placeholder.com/150'
            })
        },
        remove(index) {
            this.rows.splice(index, 1)
        }
    }
}
