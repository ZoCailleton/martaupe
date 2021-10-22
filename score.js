(function(){

    let params = {
        method: 'GET',
        mode: 'no-cors'
    }

    fetch('http://localhost:5000/scores', params)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    
    document.querySelector('.tableau-scores')

})()
