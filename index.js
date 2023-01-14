import { connect as _connect, model, Schema } from 'mongoose';
import { launch } from "puppeteer";


// Crear un modelo de datos
const Data = model('Data', new Schema({
  title: String,
  price: String
}))



// Función para extraer los datos
const scrapeCharacters = async () => {
  // Conectar a la base de datos
  await connect();

  // URL de la página web
  const url = "https://www.amazon.es/";

  // Iniciar el navegador
  const browser = await launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  // Abrir una nueva pestaña
  const page = await browser.newPage()

  // Ir a la URL
  await page.goto(url);

  // Escribir en el buscador
  await page.type("#twotabsearchtextbox", "star wars");
  // Hacer click en el botón de búsqueda
  await page.click("#nav-search-submit-button");
  // Esperar a que se cargue la página  
  await page.waitForSelector(".s-pagination-next");

  // Scroll through products
  await page.click(".s-pagination-next");
  await page.waitForSelector(".s-pagination-next");


  // Extraer los datos
  const title = await page.$$eval("h2 span.a-color-base", (nodes) =>
    nodes.map((n) => n.innerText)
  );

  const price = await page.$$eval(
    "[data-component-type='s-search-result'] span.a-price[data-a-color='base'] span.a-offscreen",
    (nodes) => nodes.map((n) => n.innerText)
  );

  // Crear un array con los datos
  const amazonSearchArray = title.slice(0, 5).map((value, index) => {
    return {
      title: title[index],
      price: price[index],
    };
  });

  // Convertir el array a JSON
  const jsonData = JSON.stringify(amazonSearchArray, null, 2);

  // Guardar los datos en la base de datos
  JSON.parse(jsonData).map(async (data) => {
    const dataSchema = new Data(data);
    try {
      await dataSchema.save();
      console.log(`Successfully saved ${dataSchema.title} to the database`);
    } catch (error) {
      console.error(`Failed to save ${dataSchema.title} to the database:`, error);
    }
  });

  // Cerrar el navegador
  await browser.close();
  console.log('Characters saved successfully!', jsonData);

};

scrapeCharacters();