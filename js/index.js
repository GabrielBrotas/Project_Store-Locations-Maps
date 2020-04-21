
var map;
var markers = [];
var infoWindow;
var locationSelect;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
         lng: -118.358080
        };
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap',
    })

    infoWindow = new google.maps.InfoWindow(); // inicializar infowindow

    searchStore();

}

// funcao para pesquisar store
function searchStore(){
    // a funcao vai ser chamada pelo icone da lupa
    //                                      nome do id do input, valor
    var zipCode = document.getElementById('zip-code-input').value;
    var foundStores = [];
    // se ele tiver algum valor
    if(zipCode){

        stores.forEach(function(store,index){
            //                                  vai pegar os 5 primeiros digitos 
            var postal = store.address.postalCode.substring(0, 5);

            if (postal == zipCode){
                foundStores.push(store);
            }
        })
    }
    else {
        // se nao tiver nenhum zipCode entao vai mostrar todas
        foundStores = stores;
    }

    clearLocations();
    showStoreMarkers(foundStores);
    DisplayStores(foundStores);
    setOnClickListener();
}


// funcao para mostrar item no mapa ao clicar na lista
function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');

    storeElements.forEach(function(element, index){         //para cada elemento
        element.addEventListener('click', function(){       // adicionar um event listener
            new google.maps.event.trigger(markers[index], 'click');
        })
    })

}


function clearLocations(){
    // se tiver alguma infowindow aberta fechar
    infoWindow.close();
    
    // remover markers do mapa, deixar limpo
    for(var i=0; i< markers.length; i++){

        markers[i].setMap(null);

    }

    markers.length = 0;

}


// funcao para mostrar as lojas
function DisplayStores(stores){
    // variavel para armazenar o html da loja
    var storesHtml = ''

    // fazer loop pelas lojas
    stores.forEach(function(store, index){

        // variavel do endereco que vai pegar no DB
        var address = store.addressLines;

        // variavel do numero que vai pegar no DB
        var phone = store.phoneNumber;

        // vai pegar o que contem na loja e adicionar nessa string para cada loja
        storesHtml += `
            <div class="store-container">
                
                <div class="store-container-background">

                    <div class="store-info-container">


                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                
                        <div class="store-phone-number">${phone}</div>
                
                    </div>
            
                    <div class="store-number-container">
                        <div class="store-number">${index+1}</div>
                    </div>

                </div>
            </div>
            `
    })

    //vai criar um replace dessa classe <div class="stores-list" > para a que criamos agora com storesHtml
    document.querySelector('.stores-list').innerHTML = storesHtml
    //especificar a classe que vai fazer o replace
}


// mostrar lojas no mapa
function showStoreMarkers(stores){
    // definir limite para o mapa
    var bounds = new google.maps.LatLngBounds();

    // fazer loop por todos os itens na lista/array stores
    // e vai nos mostrar o item
    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        
        var name = store.name;
        var address = store.addressLines[0];

        createMarker(latlng, name, address, index);
        
        bounds.extend(latlng);
    })
    map.fitBounds(bounds);
}


function createMarker(latlng, name, address, index){
    
    // codigo copiado da documentacao do google

    var html = "<b>" + name + "</b> <br/>" + address;

    // criar o marker usando a funcao new google.maps.Marker
    // esse comando vai mostrar a localizacao no mapa
    var marker = new google.maps.Marker({   
      map: map,         // Passar a variavel global map criada no inicio                
      position: latlng,  // Passar a posicao que pegamos do DB
      label: `${index+1}`, // nao pode passar numericos, entao convertemos para string
    });

    // descricao
                        // no `click` desse especifico marker
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);                 // mandar o conteudo html
      infoWindow.open(map, marker);                // abrir o map do marker clicado 
    });
    // Markers é uma lista criada no inicio
    markers.push(marker); // push = append, vai mandar o valor para a lista

}