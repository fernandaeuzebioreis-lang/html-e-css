function formatDate(dateString){ 

    if(!dateString){ 

        return ""; 

    } 

 

    const parts = String(dateString).split("-"); 

    if(parts.length !== 3){ 

        return dateString; 

    } 

 

    return parts[2] + "/" + parts[1] + "/" + parts[0]; 

} 

 

function massEvolution(user, measurements){ 

    if(!measurements.length){ 

        return "Não há aferições salvas para este usuário até o momento"; 

    } 

    if(measurements.length === 1){ 

        return "Há somente uma aferição salva. Faça mais aferições para observar sua evolução"; 

    } 

 

    const firstMeasurement = measurements[0]; 

    const lastMeasurement = measurements[measurements.length - 1]; 

    const diffMass = Number(lastMeasurement - firstMeasurement); 

 

    if(user === "ganhar_massa"){ 

        if(diffMass > 0){ 

            return "Você está dentro do objetivo. Sua massa aumentou: " + diffMass.toFixed(2).replace(".", ",") + " Kg"; 

        } 

    } 

    if(user === "reduzir_massa"){ 

        if(diffMass < 0){ 

            return "Você está dentro do objetivo. Sua massa diminuiu: " + diffMass.toFixed(2).replace(".", ",") + " Kg"; 

        } 

    } 

 

    return "Sua massa está estável"; 

} 

 

 