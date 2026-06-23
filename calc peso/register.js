$(function (){ 

   const $form = $('#form'); 

   const $email = $('#email'); 

   const $senha = $('#senha'); 

   const $resenha = $('#resenha'); 

   const $btn = $('#btnOK'); 

 

   async function hashPassword(password){ 

      

    const encode = new TextEncoder(); 

    const data = encode.encode(password); 

 

    const hashbuffer = await crypto.subtle.digest('SHA-256', data); 

 

    const hasharray = Array.from( new Uint8Array(hashbuffer)); 

    const hashhex = hasharray.map(b => b.toString(16).padStart(2,0)).join(""); 

 

    return hashhex; 

 

   } 

 

   function verifyPassword(){ 

 

   const password = $senha.val(); 

        const repassword = $resenha.val(); 

  

        if(password != repassword){ 

            alert("Senhas não são iguais!"); 

        } 

    } 

}) 

 