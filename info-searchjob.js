import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) {
        // Jika pengguna tidak memasukkan query
        await conn.sendMessage(m.chat, { text: '🔎 *Masukkan query pekerjaan yang kamu mau!*\n\nContoh: `.searchjob Security`' }, m);
        return;
    }

    // Kirim pesan loading saat mengambil data
    let loadingMessage = await conn.sendMessage(m.chat, { text: '⏳ *Mencari pekerjaan untukmu...*' }, m);

    // Query pekerjaan berdasarkan teks yang dimasukkan pengguna
    const jobQuery = encodeURIComponent(text);
    const apiUrl = `https://linkedin-data-api.p.rapidapi.com/search-jobs?keywords=${jobQuery}&locationId=92000000&datePosted=anyTime&sort=mostRelevant`;

    try {
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '6cf87a7b36mshe268db0435aae4ep198271jsn6d6dbeb1c212',
                'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
            }
        });
        let result = await response.json();

        if (result && result.data && result.data.length > 0) {
            let jobResults = result.data.slice(0, 5).map(job => 
                `💼 *${job.title}*\n🏢 ${job.company} - ${job.location}\n🔗 [Link Pekerjaan](${job.url})\n📅 *Diposting*: ${job.postDate}`
            ).join('\n\n');

            // Hapus pesan loading dan kirim hasil pencarian
            await conn.sendMessage(m.chat, { text: `✅ *Hasil pencarian untuk* _"${text}"_ *:* \n\n${jobResults}` }, m);
        } else {
            // Jika tidak ada hasil yang ditemukan
            await conn.sendMessage(m.chat, { text: `⚠️ Tidak ditemukan hasil untuk _"${text}"_.\nCoba kata kunci lain!` }, m);
        }
    } catch (error) {
        console.error(error);
        // Kirim pesan error jika terjadi kesalahan saat mengambil data
        await conn.sendMessage(m.chat, { text: '❌ Terjadi kesalahan saat mengambil data pekerjaan. Coba lagi nanti.' }, m);
    } finally {
        // Hapus pesan loading setelah selesai
        await conn.deleteMessage(m.chat, loadingMessage.key);
    }
}

handler.help = ['searchjob <query>'];
handler.tags = ['info'];
handler.command = /^(searchjob)$/i;

export default handler;
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
