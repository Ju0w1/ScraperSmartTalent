connection.query('SELECT * FROM jobs', function(error,results,fields){
    if (error) {
        throw error
    }else{
        results.forEach(result =>{
            console.log(result);
        })
    }
})