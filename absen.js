document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshBtn');
    const absenTable = document.getElementById('absenTable');

    const API_URL_ABSEN = 'http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/api/ListAbsen/GetData';

    async function loadAbsenData() {
        absenTable.innerHTML = ''; // Kosongkan tabel sebelum memuat data baru
        try {
            const response = await fetch(API_URL_ABSEN);
            const data = await response.json();

            const absenList = data.Data; // Ambil properti Data yang berisi array

            if (Array.isArray(absenList)) {
                absenList.sort((a, b) => new Date(b.CreateAt) - new Date(a.CreateAt)); // Urutkan data secara descending berdasarkan CreateAt
                absenList.forEach(absen => {
                    const date = new Date(absen.CreateAt);
                    const tanggal = date.toLocaleDateString();
                    const jam = date.toLocaleTimeString();

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${absen.uuid_card}</td>
                        <td>${absen.nama_mhs}</td>
                        <td>${tanggal}</td>
                        <td>${jam}</td>
                    `;
                    absenTable.appendChild(row);
                });
            } else {
                console.error('Expected array in property Data, got:', typeof absenList);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Load data when the page is loaded
    loadAbsenData();

    // Refresh data when the button is clicked
    refreshBtn.addEventListener('click', function() {
        loadAbsenData();
    });
});
