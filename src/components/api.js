import axios from 'axios';

    const API_URL = 'https://gremorio.donydonitasss.com/api/'; // Cambia esto si tu carpeta api está en otro lugar

    export const getBookData = async () => {
      try {
        const response = await axios.get(`${API_URL}read_book_data.php`);
        return response.data;
      } catch (error) {
        console.error('Error fetching book data:', error);
        throw error;
      }
    };

    export const saveChapter = async (chapterData) => {
      try {
        const response = await axios.post(`${API_URL}save_chapter.php`, chapterData);
        return response.data;
      } catch (error) {
        console.error('Error saving chapter:', error);
        throw error;
      }
    };

    export const deleteChapter = async (chapterId) => {
      try {
        const response = await axios.post(`${API_URL}delete_chapter.php`, { id: chapterId });
        return response.data;
      } catch (error) {
        console.error('Error deleting chapter:', error);
        throw error;
      }
    };

    export const saveMural = async (muralData) => {
      try {
        const response = await axios.post(`${API_URL}save_mural.php`, muralData);
        return response.data;
      } catch (error) {
        console.error('Error saving mural:', error);
        throw error;
      }
    };
