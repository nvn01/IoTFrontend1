document.addEventListener('DOMContentLoaded', function() {
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const dataTable = document.getElementById('dataTable');
    const deleteDataBtn = document.getElementById('deleteDataBtn');
    const updateDataBtn = document.getElementById('updateDataBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const updateDataForm = document.getElementById('updateDataForm');
    const insertDataForm = document.getElementById('insertDataForm');
    let selectedUuid = null;

    const API_URL_MAHASISWA = 'http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/api/ListMahasiswa/GetData';
    const API_INSERT_MAHASISWA = 'http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/api/ListMahasiswa/InsertData';
    const API_UPDATE_MAHASISWA = 'http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/api/proxy/UpdateData';
    const API_DELETE_MAHASISWA = 'http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/api/proxy/DeleteData';

    function loadMahasiswaData() {
        dataTable.innerHTML = ''; // Kosongkan tabel sebelum memuat data baru
        fetch(API_URL_MAHASISWA)
            .then(response => response.json())
            .then(data => {
                const mahasiswaList = data.Data;
                if (Array.isArray(mahasiswaList)) {
                    mahasiswaList.forEach(mahasiswa => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td><input type="checkbox" class="select-checkbox" data-uuid="${mahasiswa.uuid_card}"></td>
                            <td>${mahasiswa.uuid_card}</td>
                            <td>${mahasiswa.nim}</td>
                            <td>${mahasiswa.nama_mhs}</td>
                        `;
                        dataTable.appendChild(row);
                    });
                } else {
                    console.error('Expected array in property Data, got:', typeof mahasiswaList);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function getSelectedRows() {
        const checkboxes = document.querySelectorAll('.select-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.uuid);
    }

    function getSelectedRowData() {
        const selectedRows = getSelectedRows();
        if (selectedRows.length === 1) {
            return selectedRows[0];
        } else {
            return null;
        }
    }

    refreshDataBtn.addEventListener('click', function() {
        loadMahasiswaData();
    });

    deleteDataBtn.addEventListener('click', function() {
        const selectedRows = getSelectedRows();
        if (selectedRows.length > 0) {
            const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
            confirmDeleteModal.show();
        } else {
            alert('Silakan pilih setidaknya satu baris untuk dihapus.');
        }
    });

    confirmDeleteBtn.addEventListener('click', async function() {
        const selectedRows = getSelectedRows();
        if (selectedRows.length > 0) {
            try {
                // Asumsikan hanya satu UUID yang dapat dipilih untuk penghapusan
                const uuid_card = selectedRows[0];

                console.log('Deleting UUID:', uuid_card); // Logging for debugging

                const response = await fetch(API_DELETE_MAHASISWA, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uuid_card }) // Kirimkan uuid_card sebagai objek
                });

                if (response.ok) {
                    alert('Data berhasil dihapus!');
                    loadMahasiswaData();
                    const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                    confirmDeleteModal.hide();
                } else {
                    const errorMessage = await response.json();
                    alert('Gagal menghapus data: ' + errorMessage.message);
                }
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    });

    updateDataBtn.addEventListener('click', function() {
        const selectedRowData = getSelectedRowData();
        if (selectedRowData) {
            const row = document.querySelector(`input[data-uuid="${selectedRowData}"]`).parentNode.parentNode;
            const nim = row.children[2].textContent;
            const nama = row.children[3].textContent;

            document.getElementById('updateNim').value = nim;
            document.getElementById('updateNamaMhs').value = nama;
            selectedUuid = selectedRowData;

            const updateDataModal = new bootstrap.Modal(document.getElementById('updateDataModal'));
            updateDataModal.show();
        } else {
            alert('Silakan pilih tepat satu baris untuk diubah.');
        }
    });

    updateDataForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nim = document.getElementById('updateNim').value;
        const namaMhs = document.getElementById('updateNamaMhs').value;

        const updatedData = {
            uuid_card: selectedUuid,
            nim: nim,
            nama_mhs: namaMhs
        };

        try {
            const response = await fetch(API_UPDATE_MAHASISWA, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert('Data berhasil diupdate!');
                loadMahasiswaData();
                const updateDataModal = bootstrap.Modal.getInstance(document.getElementById('updateDataModal'));
                updateDataModal.hide();
            } else {
                alert('Gagal mengupdate data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    });

    insertDataForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const uuidCard = document.getElementById('uuidCard').value;

        const newData = {
            uuid_card: uuidCard
        };

        try {
            const response = await fetch(API_INSERT_MAHASISWA, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });

            if (response.ok) {
                alert('Data berhasil ditambahkan!');
                insertDataForm.reset(); // Kosongkan form
                const insertModal = bootstrap.Modal.getInstance(document.getElementById('insertDataModal'));
                insertModal.hide(); // Sembunyikan modal setelah data berhasil ditambahkan
                loadMahasiswaData();
            } else {
                alert('Gagal menambahkan data');
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    });

    // Load data mahasiswa saat halaman dibuka
    loadMahasiswaData();
});
