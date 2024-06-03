export async function fetchModel() {
    const email = 'anshsaxena4901@gmail.com'
    const apiUrl = `https://promptreality.onrender.com/fetchMain/${email}`
  
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      const modelUrl = data.modelUrl
      document.querySelector('#modelContainer').setAttribute('gltf-model', modelUrl)
    } catch (error) {
      console.error('Error fetching the model:', error)
    }
  }
  
  window.addEventListener('xrloaded', fetchModel)