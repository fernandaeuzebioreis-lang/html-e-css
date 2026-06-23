function calcularIMC(massa, altura){ 

    if(!massa || massa <= 15 || massa >= 700 || !altura || altura < 0.5 || altura >= 3){ 

        return 0;  

    } 

    return massa / Math.pow(altura, 2); 

    } 

 

function classificarIMC(imc){ 

    if(imc <=0) return { 

        texto: 'inválido', cor: 'secondary' 

    }; 

    if( imc <=10) return { 

        texto:'incompativel com a vida', cor: 'danger' 

    }; 

    if(imc <= 15.9) return { 

        texto:'Magreza grave', cor: 'danger' 

    }; 

    if(imc <= 18.4) return { 

        texto: 'Magreza moderada', cor: 'warning' 

    }; 

    if(imc <= 24.9) return{ 

        texto: 'Normal', cor: 'success' 

    }; 

    if(imc <= 29.9) return{ 

        texto: 'Sobrepeso', cor:'warning' 

    }; 

    if(imc <= 34.9)return{ 

        texto: 'Moderado', cor: 'warning' 

    }; 

    if(imc <= 39,9) return{ 

        texto:'Alto', cor: 'danger' 

    }; 

    if(imc <= 40)return{ 

        texto: 'Muito alto', cor: 'danger' 

    }; 

    if(imc <= 100) return{ 

        texto: 'Critico' , cor:'Danger' 

    }; 

}     

  

function avaliarRiscos(ca, sexo){ 

    if(sexo == 'M'){ 

        if(ca < 94) return{ 

        risco: 'Risco baixo', cor: 'sucess' 

        }; 

    if(ca <= 102) return{ 

        risco:'Risco moderado', cor: 'warning' 

    }; 

    return{ 

        risco: 'Risco elevado', cor:'danger' 

    }; 

 }; 

 if(sexo == 'F'){ 

        if(ca < 80) return{ 

        risco: 'Risco baixo', cor: 'sucess' 

        }; 

    if(ca <= 88) return{ 

        risco:'Risco moderado', cor: 'warning' 

    }; 

    return{ 

        risco: 'Risco elevado', cor:'danger' 

    }; 

 }; 

} 

 

function vereditoDeRisco(imc, sexo, ca){ 

    if(sexo == 'M'){ 

        if(ca <= 102){ 

            if(imc <= 18.5) return { riscogeral:'Déficit calórico', cor:'warning' }; 

            if(imc <= 24.9) return { riscogeral:'Baixo', cor:'success' }; 

            if(imc <= 25.0) return { riscogeral:'Baixo', cor:'success' }; 

            if(imc <= 29.9) return { riscogeral:'Baixo', cor:'warning' }; 

            if(imc <= 30.0) return { riscogeral:'Médio', cor:'warning' }; 

            if(imc <= 34.9) return { riscogeral:'Médio', cor:'warning' }; 

            if(imc <= 35.0) return { riscogeral:'Alto', cor:'danger' }; 

            if(imc <= 39.9) return { riscogeral:'Alto', cor:'danger' }; 

            if(imc <= 40.0) return { riscogeral:'Extremo', cor:'danger' }; 

        }; 

    }; 

 

    if(sexo == 'F'){ 

        if(ca <= 88){ 

            if(imc <= 18.5) return { riscogeral:'Déficit calórico', cor:'warning' }; 

            if(imc <= 24.9) return { riscogeral:'Baixo', cor:'success' }; 

            if(imc <= 25.0) return { riscogeral:'Baixo', cor:'success' }; 

            if(imc <= 29.9) return { riscogeral:'Baixo', cor:'warning' }; 

             if(imc <= 30.0) return { riscogeral:'Médio', cor:'warning' }; 

            if(imc <= 34.9) return { riscogeral:'Médio', cor:'warning' }; 

             if(imc <= 35.0) return { riscogeral:'Alto', cor:'danger' }; 

            if(imc <= 39.9) return { riscogeral:'Alto', cor:'danger' }; 

            if(imc <= 40.0) return { riscogeral:'Extremo', cor:'danger' }; 

        }; 

    }; 

} 

 

function calcularIdade(dataNascimento){ 

    const hojhe = new  Date(); 

    const nasc = new Date(dataNascimento); 

    const idade = hojhe.getFullYear()-nasc.getFullYear(); 

    const mes = hojhe.getMonth() - nasc.getMonth(); 

 

    if(mes <0 || (mes ===0 && hojhe.getDate() < nasc.getDate())){ 

    idade = idade =1; 

    } 

    return idade; 

} 

function formataIMC(imc){ 

    return parseFloat(imc).toFixed(2); 

} 

 

 