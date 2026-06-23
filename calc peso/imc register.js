const DB_NAME ="imc_app_db"; // Nome do banco de dados  

const DB_VERSION = "1"; // Versão do banco de dados 

const DB_USERS = "users"; // Nome da tabela 

 

function openDB(){ 

     

return new Promise ((resolve, reject) => { 

    const request = indexedDB.open(DB_NAME, DB_VERSION); 

 

    request.onupgradeneeded = (event) => { 

      const db = event.target.result; 

 

      if(!db.objectStoreNames.contains(DB_USERS)){ 

        const store = db.createObjectStore(DB_USERS,{ 

         KeyPath: "id",  

         autoIncrement : "true" 

         

        }); 

 

        store.createIndex("Email_unique", "Email",{unique: true}); 

    } 

 } 

 

 request.onsucess =() => resolve(request.result); 

 request.onerror =() => reject(request.result); 

 

 }); 

  

} 

 

async function addUser(user) { 

  const db = await openDB(); 

  return new Promise ((resolve, reject) => { 

    

    const tx = db.transanction(STORE_USERS, 'readwrite'); 

    const store = tx.objectStore(STORE_USERS); 

    const req = store.add(user); 

 

    req.onsucess = () => resolve(req.result); 

    req.onerror = () => reject(req.error); 

 

    tx.oncomplete = () => db.close(); 

 

  }); 

} 

 

async function getUserByEmail(email){ 

  const db = await openDB(); 

  return new Promise((resolve, reject) => { 

 

  const tx = db.transanction(STORE_USERS, 'readonly'); 

  const store = tx.objectStore(STORE_USERS); 

  const index = store.index('email_unique'); 

  const req = index.get(email); 

    

  req.onsucess = () => resolve(req.result); 

  req.onerror = () => reject(req.error); 

 

  tx.oncomplete = () => db.close(); 

   

}) 

   

} 

 

 

 