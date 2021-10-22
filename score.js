(function(){

    let params = {
        method: 'GET',
        mode: 'no-cors'
    }

    fetch('http://127.0.0.1:5000/scores', params)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    
    document.querySelector('.tableau-scores')

})()
