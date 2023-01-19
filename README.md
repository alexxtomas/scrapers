# Scraper

## Introducción

---

El web scraping (o raspado web) es una técnica utilizada para extraer información de sitios web. Consiste en utilizar programas o scripts para automatizar la navegación por un sitio web y recolectar información de manera automatizada. Los datos recolectados pueden ser utilizados para diversos fines, como la monitorización de precios, la recopilación de datos para análisis, la generación de contenido automatizado, entre otros. Algunos ejemplos de uso del web scraping incluyen el análisis de tendencias en redes sociales, la extracción de datos de sitios de comparación de precios, la recopilación de noticias y actualizaciones de precios en sitios de comercio electrónico.

## Como se hace el web scraping?

---

La manera de hacer web scraping puede variar, dependiendo de si la página se renderiza en el cliente es decir en nuestro navegador o si por lo contrario esta se renderiza en el servidor.

No hace falta que entiendas estos conceptos ahora mismo, solo tienes que quedarte con un par de detalles.

### Caso 1 - El código ya esta cargado

---

Si entramos a [Amazon](https://www.amazon.es/ref=nav_logo) e inspeccionamos el código fuente de la página podremos ver como todo el HTML ya esta disponible. Podemos acceder al código fuente pulsando `CTRL+ U` o click derecho en la página y pulsando sobre inspeccionar.

![Screenshot_20230115_090459.png](public/Screenshot_20230115_090459.png)

Como verás nos abre una pestaña con mucho código HTML este es el que se representa en la página y ya lo tenemos disponible desde un principio, esto significa que no estamos cargando nosotros el código si no que viene desde el servidor ya cargado para que nosotros lo podamos consumir, esto hará que nuestro scraping sea mas eficiente y requiera de menos recursos. Para este caso vamos a utilizar [Cheerio](https://cheerio.js.org/index.html).

### Caso 2 - El código aun no esta cargado

---

A diferencia de Amazon hay otras páginas la cuál no nos responden con el código ya cargado y es el cliente es decir nosotros somos los que el que tenemos que cargar este código.

Por ejemplo si nos dirigimos a [Youtube](https://www.youtube.com/) y hacemos lo mismo que en el caso anterior, podremos ver que el HTML que vemos en la página no esta disponible al inspeccionar el código fuente.

Esto es debido a que es una página dínamica.

En este caso para hacer scraping en una página como esta necesitamos de una herramienta que nos permita levantar un navegador para ir seleccionando los elementos de la página.

Para ello existen varias herramientas que permiten hacerlo, en esta guía vamos a utilizar [Pupeteer](https://pptr.dev/) que es una de la más utilizadas.

Esta manera de hacer scraping es la menos eficiente ya que cada vez que tenemos que realizar scraping necesitamos levantar un navegador entero y esto es bastante costoso.

Pero por otro lado esta muy guay ya que es muy visual por que podemos visualizar como el navegador va ejecutando las instrucciones que recibe.

## Antes de empezar…

---

Si te es difícil seguir el paso a paso o algo no te funciona correctamente tienes el código ya resuelto y totalmente funcional en este repositorio.

[https://github.com/alexxtomas/scrapers](https://github.com/alexxtomas/scrapers)

Contiene tanto el scraper de Amazon como el de Youtube.

## Realizando scraping a Amazon

---

Como hemos visto anteriormente para realizar scraping Amazon necesitamos aplicar el caso 1 es decir utilizar la herramienta [Cheerio](https://cheerio.js.org/index.html).

Bien, pero que es realmente Cheerio?

Cheerio es una librería open-source que nos ayuda a extraerá información de un código HTML que le proporcionemos, proveyéndonos una API para manipular los datos.

Empecemos a crear el proyecto.

1. Creamos la carpeta que contendrá nuestro scraper y entramos en ella.

   ```bash
   mkdir amazon_scraper

   cd amazon_scraper
   ```

2. Inicializamos un proyecto de node.

   ```bash
   npm init -y
   ```

3. Añadimos type module para utilizar ECMAScript modules en el package.json

   ```json
   "type": "module"
   ```

4. Instalamos las dependencias que vamos a necesitar.

   ```bash
   npm install cheerio mongoose
   ```

   Como dependencias de desarrollo instalaremos un linter para que nuestro código sea lo más solido posible.

   ```bash
   npm install -D standard
   ```

5. Configuramos el linter para ello añadimos las siguientes líneas al final de nuestro `package.json`

   ```json
   // ./amazon_scraper/package.json
   // ...
   "eslintConfig": {
       "extends": "./node_modules/standard/eslintrc.json",
       "rules": {
         "space-before-function-paren": 0
       }
     }
   ```

6. Creamos el punto de entrada de nuestro scraper.

   ```bash
   touch index.js
   ```

Una vez seguidos estos pasos debes tener una carpeta amazon_scraper que cuenta con un proyecto de node con sus respectivas dependencias y un archivo `index.js` vacío.

Empecemos a crear nuestro scraper de Amazon.

1. Creamos un archivo con el nombre `scraper.js`

   ```bash
   touch amazon_scraper.js
   ```

2. Importamos la función `load` desde `cheerio` la cual recibirá como parámetro el código HTML de la página y nos permitirá interactuar sobre él.

   ```jsx
   // ./amazon_scraper/scraper.js
   import { load } from 'cheerio'
   ```

3. Ahora vamos a crear una función asíncrona con el nombre de `scrapeProducts` la cuál recibirá la URL de los productos de Amazon a scrapear y hará la magia.

   Vayamos paso a paso.

   1. Realizamos una petición GET mediante `fetch` para recibir el HTML de Amazon. Todo el código que escribamos en la función ira dentro un `try catch` . También al iniciar la función y durante todo el scraper iremos dejando `console.log` para informar de los procesos o errores de este mismo.

      ```jsx
      // ./amazon_scraper/scraper.js
      // ...
      export async function scrapeProducts(URL) {
      	console.log('Fetching Products...🤖')
      	try {
          const response = await fetch(URL)
          const html = await response.text()

      	} catch(err) {
      			console.error('Something went wrong when scraping the data ❌')
      	    throw err
      }
      ```

      P.D: Si Amazon fuese una página que no contiene el HTML cuando inspeccionamos la página como hemos visto en el caso 2 esta respuesta no contendría el HTML que necesitamos de la página.

   2. Si todo ha ido bien en nuestra variable `html` tenemos el código que necesitamos. Si eres un poco avispado sabras que debemos hacer ahora, si tenemos que pasar este código HTML a la función `load` que hemos importado anteriormente de `cheeerio`, para que podamos empezar extraer la información que necesitamos.

      ```jsx
      // ./amazon_scraper/scraper.js
      // ...
      export async function scrapeProducts(URL) {
      	console.log('Fetching Products...🤖')
      	try {
          // ...
      		const $ = load(html)

      	} catch(err) {
      			console.error('Something went wrong when scraping the data ❌')
      	    throw err
      }

      ```

   3. Bien, ya podemos interactuar con este código html gracias a la API que nos proporciona Cheerio. Para conocer cuales son todas las opciones que este nos proporciona te recomiendo que leas su documentación. Pero a groso modo este nos permitirá encontrar elementos en el código mediante selectores de `CSS` . Así que nuestra tarea se basa en encontrar atributos de la etiqueta html que sean únicos para la información que queremos encontrar. En este caso queremos los productos de una búsqueda de Amazon, veamos que atributos podemos extraer.

      ![Screenshot_20230116_031454.png](public/Screenshot_20230116_031454.png)

      Como puedes ver el elemento padre, es decir el elemento que contiene toda la información sobre el producto es un `div` con las siguiente clase `sg-col-4-of-24 sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col s-widget-spacing-small sg-col-4-of-20` . Si capturamos todos estos divs (los padres) por cada producto, posteriormente podremos buscar dentro de el (sus hijos) toda la información del producto.

   4. Extraemos la información que necesitamos y la guardamos en una variable llamada `products`.

      ```jsx
      // ./amazon_scraper/scraper.js
      // ...
      export async function scrapeProducts(URL) {
      	console.log('Fetching Products...🤖')
      	try {
          // ...
      		// Creamos un array donde almacenaremos nuestros productos
      		const products = []
      		// Selecionamos mediante un selector de css el elemento padre de cada producto
          $(
            'div.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20'
          ).each((_i, el) => {
      			// _i es igual al indice, el es igual al elemento html
      			// Cada elemento es igual al div de cada producto que hemos visto anteriormente
            const product = $(el)
      			/* Buscamos la información mediante selectores de CSS y mediante .text() o .attr()
      				 ndicamos la información con la que nos queremos quedar*/
            const title = product.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const image = product.find('img.s-image').attr('src')

            const link = product.find('a.a-link-normal.a-text-normal').attr('href')

            const reviews = product
              .find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small')
              .children('span')
              .last()
              .attr('aria-label')

            const stars = product
              .find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span')
              .attr('aria-label')

            const price = product.find('span.a-price > span.a-offscreen').text()

      			// Creamos nuestro objeto con todos los elementos del producto
            const element = {
              title,
              image,
              link: `https://amazon.com${link}`,
              price
            }
      			/* Debido a que no todos los productos tienen reviews o estrellas
      				 los añadimos al producto solo si existen*/
            if (reviews) {
              element.reviews = Number(reviews)
            }

            if (stars) {
              element.stars = stars
            }
      			// Añadimos nuestro producto a nuestro array de productos
            products.push(element)
          })
      		// Devolvemos nuestro array de productos
          return products
      	} catch(err) {
      			console.error('Something went wrong when scraping the data ❌')
      	    throw err
      }

      ```

   Con este código estamos extrayendo la información por cada producto. Es normal que no lo entiendas todo a la perfección ya que para ello debes leer la documentación de `Cheerio` . Simplemente quédate con que como hemos visto anteriormente los productos contienen un elemento div que consta con una clase la cuál utilizamos para seleccionarlo dentro del código HTML y posteriormente buscamos la información del producto dentro de este mismo.

   Por ejemplo donde estamos extrayendo la imagen

   ```jsx
   const image = product.find('img.s-image').attr('src')
   ```

   Debes leerlo de esta manera, dentro de cada div de los productos búscame una elemento `img` con la clase `s-image` y de este elemento dame el contenido de su `src`

Perfecto ya contamos con nuestra función la cuál scrapeara la información de los productos, pero también queremos almacenar la información en una base de datos, en este caso [MongoDB](https://www.mongodb.com/) , para ello hemos instalado [Mongoose](https://mongoosejs.com/docs/guide.html).

Empecemos a crear nuestro modelo y conexión a la base de datos.

1. Creamos el archivo el cuál contendrá la función que nos permitirá conectarnos a la base de datos.

   ```bash
   touch db_connection.js
   ```

2. Creamos la función para conectarnos a la base de datos.

   ```jsx
   // ./amazon_scraper/db_connection.js
   import mongoose from 'mongoose'

   // Nos conectamos a la base de datos
   export async function connectToDb(URI) {
     console.log('Connecting to database...🤖')
     await mongoose
       .set('strictQuery', false)
       .connect(URI)
       .then((db) => console.log(`Connected to database -> ${db.connection.name} ✅`))
       .catch((err) => {
         console.error('Failed to connect to database ❌')
         throw err
       })
   }
   ```

   La URI vendrá por parámetro por que dependiendo de los productos que queramos scrapear el nombre de la colección de `MongoDB` cambiara.

3. Creamos el archivo que contendrá nuestro modelo de `Mongoose` para los productos scrapeados.

   ```jsx
   touch product_model.js
   ```

4. Creamos el modelo

   ```jsx
   import { model, Schema } from 'mongoose'

   const productSchema = new Schema(
     {
       title: { type: String, required: true, unique: true },
       image: {
         type: String,
         required: true,
         // Añadmios una imagen por defecto por si acaso.
         default: 'https://www.odoo.com/web/image/res.users/1072846/image_1024?unique=3f33558'
       },
       link: { type: String, required: true, unique: true },
       price: { type: String, required: true },
       /* Como hemos visto en el scraper estos valores pueden no estar presentes 
   			 por eso no son requeridos. */
       reviews: Number,
       stars: String
     },
     {
       // Mostrará la fecha de cración o última modificación
       timestamps: true,
       // Mongoose elimina el __v que crea MongoDB cuando nos devuelve la información
       versionKey: false
     }
   )

   export const Product = model('Product', productSchema)
   ```

El scraper va a recibir por argumentos el producto a buscar en Amazon, para acceder a los argumentos que se le pasan por terminal en node podemos utilizar el [process.argv](https://www.geeksforgeeks.org/node-js-process-argv-property/) . Simplemente vamos a acceder a estos argumentos y comprobar que se están introduciendo correctamente en nuestro `index.js` , también vamos a importar todo lo que necesitaremos en este archivo y ejecutar las funciones.

1. Importamos las funciones creadas anteriormente y nuestro modelo.

   ```jsx
   // ./amazon_scraper/index.js
   import { connectToDb } from './db_connection.js'
   import { Product } from './product_model.js'
   import { scrapeProducts } from './scraper.js'
   ```

2. Accedemos a los valores de `process.argv` y realizamos distintas comprobaciones para asegurarnos de que nuesto scraper funcione correctamente.

   ```jsx
   // ./amazon_scraper/index.js
   // ...
   const [, , ...productToSearch] = process.argv

   if (productToSearch.length > 1) {
     console.log(
       'If the product name contains spaces, enter the product name in quotes like this "star wars"🤖'
     )
     process.exit(1)
   }

   if (!productToSearch.length) {
     console.log('Please provide a product to search!!!🤖')
     process.exit(1)
   }
   ```

3. Formateamos los el valor introducido para que este sea valido.

   ```jsx
   // ./amazon_scraper.js
   // ...
   const productForURL = productToSearch[0].replaceAll(' ', '+')
   const productForURI = productToSearch[0].replaceAll(' ', '_')
   ```

   Para la URL necesitamos remplazar los espacios por `+` debido a que en la URL de amazon los espacios de remplazan por este signo. Prueba a buscar en Amazon star wars veras como en la URL star wars de cambia a star+wars.

   Para la URI necesitamos remplazar los espacios por cualquier otro valor ya que romeria la URI el tener espacios. Este valor lo asignaremos a la URI para que el nombre de la colección de MongoDB se asocie al nombre de la búsqueda realizada.

4. Añadimos los valores a la URI y URL .

   ```jsx
   // ./amazon_scraper.js
   // ...
   const URL = `https://www.amazon.es/s?k=${productForURL}&crid=2M8FD9OZE91ZJ&sprefix=%2Caps%2C92&ref=nb_sb_ss_recent_1_0_recent`
   // Debes cambiar la URI por la tuya y añadir Amazon_${productForURI} como esta añadido en este ejemplo
   const URI = `mongodb+srv://root:root@cluster0.fvg4s0k.mongodb.net/Amazon_${productForURI}?retryWrites=true&w=majority`
   ```

5. Nos conectamos a la base de datos.

   ```jsx
   // ./amazon_scraper.js
   // ...
   await connectToDb(URI)
   ```

6. Empezamos a scrapear los productos de la URL y los guardamos en la base de datos.

   ```jsx
   // ./amazon_scraper.js
   // ...
   scrapeProducts(URL).then(async (products) => {
     console.log(`Fetched ${products.length} products successfully✅`)
     console.log('Saving to database...🤖')
     await Product.insertMany(products)
       .then(() => console.log('Products saved succesfully to database✅'))
       .catch((err) => {
         console.error('Something went wrong when saving products to database❌')
         throw err
       })
   })
   ```

Ya tenemos nuestro scraper creado, pero como lo hacemos funcionar? Para ello vamos hacer que nuestro scraper actúe como un script.

1. Añadimos esta línea al principio de todo de nuestro `index.js`

   ```jsx
   #!/usr/bin/env node
   ```

2. Añadimos nuestro `index.js` al apartado [bin](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#bin) del `package.json`.

   ```jsx
   // ./amazon_scraper/package.json
   // ...
   "bin": {
       "amazonScraper": "./index.js"
     },
   ```

Con esto podemos ejecutar el comando `npm link` en una terminal dentro de la carpeta `amazon_scraper` y posteriormente ejecutar `amazonScraper nombreDeLaBusqueda` y se ejecutará nuestro código. Hay que tener en cuenta que si queremos buscar un valor que tenga espacios debemos añadirlo entre `“”` , por ejemplo `amazonScraper “star wars”` .

## Realizando scraping a Youtube

---

En este caso aplicamos el caso 2 debido a que [Youtube](https://www.youtube.com/) es una página dinámica y no contamos con el HTML al inspeccionar la página. Deberemos utilizar librerías como [Puppeteer](https://pptr.dev/).

Qué es realmente Puppeteer ? Es una librería que nos proporciona una API de alto nivel con la cuál podemos controlar Chrome. De lo que trata este tipo de scraping es de levantar un navegador entero y controlarlo mediante la líbreria. Deberemos selecionar mediante selectores de css los elementos con los que queremos interactuar y el navegador interactuará con ellos como si de un usuario se tratase.

Como en el anterior scraping que hemos hecho a Amazon necesitamos crear una carpeta y en ella inicializar un proyecto de Node. A esta carpeta yo le voy a llamar `youtube_scraper`.

Una vez hecho esto instalamos las dependencias que vamos a necesitar.

```bash
npm i mongoose puppeteer ytdl-core
```

[ytdl-core](https://github.com/fent/node-ytdl) es una libreria que nos permitirá obtener información de los videos de scrapemos para añadir esta información a nuestra base de datos. Esta libreria también nos permite descargar los videos asi que te puedes animar y crear un descargador de videos de Youtube.

Posteriormente añadmis el linter.

```bash
npm i -D standard
```

```json
// ./youtube_scraper/package.json
// ...
"eslintConfig": {
    "extends": "./node_modules/standard/eslintrc.json",
    "rules": {
      "space-before-function-paren": 0
    }
  }

```

El funcionamiento de este scraper va a ser igual que el del anterior, ejecutaremos en terminal el nombre del script y le pasaremos la búsqueda que queremos realizar. Para ello añadamos el `bin` en el `package.json` .

```json
// ./youtube_scraper/package.json
// ...
"bin": {
    "youtubeScraper": "./index.js"
  },
// ...
```

El código de nuestro scraper va a estar en el `index.js` dentro de una función autoejecutada. Este es el código que va a dar instrucciones al navegador, va a esperar a ciertos eventos y seleccionara elementos de Youtube mediante selectores de CSS. La otra parte del código como puede ser la conexión a la base de datos entre otras funcionalidades estarán separadas en una carpeta `logic` .

También contaremos con una carpeta llamada `models` que contendra nuestros modelos de `Mongoose`.

### Creamos nuestros modelos

---

Creamos la carpeta models y añadimos dos archivos, uno llamado `author_model.js` y otro llamado `video_model.js`

```jsx
mkdir models
touch author_model.js
touch video_model.js
```

En el archivo author_model.js vamos a crear nuestro model tal que así

```jsx
// ./youtube_scraper/models/author_model.js
import { model, Schema } from 'mongoose'

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    channelURL: { type: String, required: true },
    userURL: { type: String, required: true },
    verified: { type: Boolean, required: true },
    subscribers: { type: String, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Author = model('Author', authorSchema)
```

Y el modelo Video lo vamos a crear así.

```jsx
// ./youtube_scraper/models/video_model.js
import { model, Schema } from 'mongoose'

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoDuration: { type: String, required: true },
    isFamilySafe: { type: Boolean, required: true },
    viewCount: { type: String, required: true },
    category: { type: String, required: true },
    publishDate: { type: String, required: true },
    keywords: { type: [String], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    isPrivate: { type: Boolean, required: true },
    isLiveContent: { type: Boolean, required: true },
    likes: { type: String, required: true },
    dislikes: { type: String, required: true },
    ageRestricted: { type: Boolean, required: false },
    link: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Video = model('Video', videoSchema)
```

## Creamos la lógica de nuestra apliación

---

Vamos a crear la carpeta `logic` y dentro de ella una llamada `db` .

```bash

mkdir logic
cd logic
mkdir db
```

Dentro de `db` crearemos dos archivos, uno llamado `db_connection.js` y `save_data_to_db.js`

```bash
touch db_connection.js
touch save_data_to_db.js
```

En el archivo `db_connection.js` crearemos la función que nos permitira conectarnos a la base de datos.

```jsx
// ./youtube_scraper/logic/db/db_connection.js
import mongoose from 'mongoose'

export async function connectToDb(URI) {
  console.log('Connecting to database...🤖')
  await mongoose
    .set('strictQuery', false)
    .connect(URI)
    .then(() => console.log('Connected to database ✅'))
    .catch((err) => {
      console.error('Failed to connect to database ❌')
      throw err
    })
}
```

En el archivo `save_data_to_db.js` creamos la función con la cuál guardaremos en la base de datos los autores y los videos que hemos scrapeado.

```jsx
// ./youtube_scraper/logic/db/save_data_to_db.js
import { Author } from '../../models/author_model.js'
import { Video } from '../../models/video_model.js'
import { log } from '../log.js'
export async function saveDataToDb({ authors, videos }) {
  Promise.all([await Author.insertMany(authors), await Video.insertMany(videos)])
    .then(() => {
      log({
        message: 'All videos and their authors have been saved to the database successfully 🚀'
      })
    })
    .catch((err) => {
      log({ message: 'Error while saving data to database ❌', err: true })
      throw err
    })
}
```

Como se puede ver se esta importando una función llamada `log` la cuál se esta utilizando como un `console.log`, lo útil de esta función es que nos permite añadir a todos los console.log un prefijo. Vamos a crearla.

```jsx
// ./youtube_scraper/logic/log.js

const PREFIX = 'Youtube Scraper 🤖 - '

export function log({ message, err = false }) {
  if (!err) {
    console.log(PREFIX, message)
  } else {
    console.error(PREFIX, message)
  }
}
```

Como hemos hecho anteriormente necesitamos extraer el valor que queremos buscar de la terminal, para ello creamos el archivo `extract_video_to_search.js` y en el crearemos una función la cuál extraerá este valor como hemos hecho en el scraper anterior.

```jsx
// ./youtube_scraper/logic/extract_video_to_search.js
export function extractVideoToSearch() {
  const [, , ...valueProvided] = process.argv

  if (valueProvided.length > 1) {
    console.log(
      'If the product name contains spaces, enter the product name in quotes like this "star wars"🤖'
    )
    process.exit(1)
  }

  if (!valueProvided.length) {
    console.log('Please provide a product to search!!!🤖')
    process.exit(1)
  }
  const [videoToSearch] = valueProvided

  return { videoToSearch, formattedVideoToSearch: videoToSearch.replaceAll(' ', '_') }
}
```

Por último tenemos que crear una función para formatear los datos. La librería `ytdl-core` nos proporciona una función la cuál nos permite obtener información de un video facilitándole un link.

Nosotros no queremos toda la información ya que hay mucha que no nos sirve para nada. Vamos a extraer la información de lo que nos devuelve esta función a lo que nosotros queremos. Vamos a querer quedarnos con la información que previamente hemos definido en los modelos. En esto consiste esta función en quedarnos solo con la información que nos interesa y ignorar la que no.

```jsx
// ./youtube_scraper/logic/format_data.js
import ytdl from 'ytdl-core'
export async function formatData({ authors, videos }) {
  for (const i in videos) {
    const video = videos[i]
    const { link } = video
    try {
      const { videoDetails } = await ytdl.getInfo(link)

      const {
        name,
        user,
        channel_url: channelURL,
        user_url: userURL,
        verified,
        subscriber_count: subscribers
      } = videoDetails.author
      authors[i] = {
        name,
        user,
        channelURL,
        userURL,
        verified,
        subscribers: subscribers.toString()
      }
      const {
        description,
        lengthSeconds: videoDuration,
        isFamilySafe,
        viewCount,
        category,
        publishDate,
        keywords,
        isPrivate,
        isLiveContent,
        likes,
        dislikes,
        age_restricted: ageRestricted,
        video_url: videoURL
      } = videoDetails
      videos[i] = {
        ...video,
        description: description ?? '',
        videoDuration: `${videoDuration} seconds`,
        isFamilySafe,
        viewCount,
        category,
        publishDate,
        keywords: keywords ?? [],
        isPrivate,
        isLiveContent,
        likes: likes ?? 'Unknown',
        dislikes: dislikes ?? 'Unknown',
        ageRestricted,
        videoURL
      }
    } catch (err) {
      console.error(`Error when formatting ${video.title} ❌`)
    }
  }
}
```

### Creamos nuestro scraper

---

Bien toca crear ya la funcionalidad que como en el caso del scraper de Amazon nos permita obtener los datos de la página. Solo vamos a obtener el titulo y el link de todos los videos que aparezcan en resultados cuando realicemos la busqueda mediante este metodo. Los demás datos los vamos a obtener con la función creada anteriormete la cuál se encuentra en el archivo `format_data.js` , en esta le pasamos el link de los videos que hemos scrapeado y esta obtiene y formatea todos los datos de los videos.

Vamos a scrapear los datos para ello en el `index.js` creamos una función autoejecutada, en la cuál ejecutaremos toda la lógica de nuestro scraping e iremos ejecutando las funciones previamente creadas.

```jsx
#!/usr/bin/env node
// ./youtube_scraper/index.js
/* eslint-disable camelcase */
import puppeteer from 'puppeteer'
import { connectToDb } from './logic/db/db_connection.js'
import { saveDataToDb } from './logic/db/save_data_to_db.js'
import { extractVideoToSearch } from './logic/extract_video_to_search.js'
import { formatData } from './logic/format_data.js'
import { log } from './logic/log.js'
;(async () => {
  const { videoToSearch, formattedVideoToSearch } = extractVideoToSearch()

  // Acuerdate de pegar tu propia URI y añadir el valor de formattedVideoToSearch como en este ejemplo
  const URI = `mongodb+srv://root:root@cluster0.xmqbgxh.mongodb.net/${formattedVideoToSearch}?retryWrites=true&w=majority`

  log({ message: 'Configuring the browser' })

  // Configuramos el navegador que se va a lanzar para poder visualizarlo
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  // Abrir una nueva pestaña
  log({ message: 'Opening the browser' })
  const page = await browser.newPage()

  log({ message: 'Going to youtube' })
  // Ir a la URL
  await page.goto('https://www.youtube.com')

  log({ message: 'Accepting youtube cookies' })
  // Esperar a que el botón este disponible
  const acceptAllButton = await page.waitForSelector(
    'button[aria-label="Accept the use of cookies and other data for the purposes described"]'
  )
  // Hacer click en el botón
  await acceptAllButton.click()

  // Esperar a que la página se refresque
  await page.waitForNavigation()
  log({ message: 'Typing in the serach bar' })
  const searchInput = await page.$('input#search')
  // Escribir en la barra de búsqueda
  await searchInput.type(videoToSearch)

  log({ message: 'Clicking on the search button' })
  // Esperar a que la el input contenga el valor que hemos introudcido
  await page.waitForFunction(`document.querySelector('input#search').value === '${videoToSearch}'`)
  // Hacer click en el botón para buscar
  await page.click('button#search-icon-legacy')

  await page.waitForNavigation()
  log({ message: 'Selecting the videos' })
  const videos = await page.evaluate(() => {
    // Obtener todos los titulos y links de los videos
    const videoElements = document.querySelectorAll('.ytd-video-renderer #video-title')
    const videos = []
    videoElements.forEach(({ textContent, href: link }) => {
      const title = textContent.replace(/\n/g, '').trim()
      videos.push({ title, link })
    })
    return videos
  })

  const totalVideos = videos.length
  log({ message: `${totalVideos} selected` })
  if (!totalVideos) {
    log({ message: 'Something went wrong, please try again ❌', err: true })
    process.exit(1)
  }
  log({ message: 'Formatting all the videos. This may take a while, please wait.' })

  const authors = []

  await formatData({ authors, videos })
  log({ message: 'Videos formatted successfully!' })
  log({ message: 'Connecting to database...' })

  await connectToDb(URI)

  log({ message: 'Saving videos to database!. This may taye a while, please wait.' })
  await saveDataToDb({ authors, videos })
  log({ message: 'Finsihed the scraping' })
  setTimeout(() => {
    process.exit(1)
  }, 3000)
})()
```

Y listo para usarlo podemos debemos ejectuar dentro de nuestra carpeta `youtube_scraper` el comando `npm link` y a partir de ahora ejecutando en nuestra terminal `youtubeScraper` podremos scrapear los datos que queramos. Por ejemplo para scrapear videos sobre star wars realizaremos lo siguiente.

```bash
youtubeScraper "star wars"
```
