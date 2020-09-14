class View {
  constructor() {
    this.mainBlock = document.querySelector("#main");

    this.input = document.createElement("input");
    this.input.classList.add("inputEnterCity");
    this.input.placeholder = "Enter the city";

    this.addCityButton = document.createElement("button");
    this.addCityButton.innerHTML = "Add";
    this.addCityButton.classList.add("addCityBtn");

    this.clearListofCitiesButton = document.createElement("button");
    this.clearListofCitiesButton.innerHTML = "Clear";
    this.clearListofCitiesButton.classList.add("deleteCityBtn");

    this.listOfCities = document.createElement("ul");
    this.listOfCities.classList.add("listCities");
  }
  
  initReneder() {
    this.mainBlock.append(this.input, this.addCityButton, this.clearListofCitiesButton, this.listOfCities);
  }
  
  
  renderListOfCities(nameOfCity, id, temp, clouds, windSpeed) {
    const item = document.createElement("li");
    item.classList.add("listCitiesItem");

    const text = document.createElement("div");
    text.classList.add("divForCitiesInList");
    text.innerHTML = `${nameOfCity} <br>
    ${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`;
  
    const delCityButton = document.createElement("button");
    delCityButton.classList.add ("listBtnDelete");
    delCityButton.innerHTML = "Delete";
    delCityButton.setAttribute("data-action", "delete");
    delCityButton.setAttribute("data-id", id);

    const editCityButton = document.createElement("button");
    editCityButton.innerHTML = "Edit";
    editCityButton.classList.add("listBtnEdit");
    editCityButton.setAttribute("data-action", "edit");
    editCityButton.setAttribute("data-id", id);

    const wrapperForEdit = document.createElement("div");
    wrapperForEdit.classList.add('hide');

    const inputForEdit = document.createElement("input");
    inputForEdit.value = nameOfCity;
    inputForEdit.classList.add("inputEditCity");

    const saveEditions = document.createElement("button");
    saveEditions.classList.add("listBtnSave");
    saveEditions.innerHTML = "Save";


    saveEditions.setAttribute("data-action", "saveedit" );
    saveEditions.setAttribute("data-id", id);
    
    wrapperForEdit.append(inputForEdit, saveEditions);
    item.append(text, editCityButton, wrapperForEdit, delCityButton);
    this.listOfCities.append(item);  
  }
}

class ViewGeoExchange {
  constructor() {
    this.mainBlock = document.querySelector("#main");

    this.wrapperForGeoExchange = document.createElement("div");
    this.wrapperForGeoExchange.classList.add("wrapperForGeoExchange"); // Див обертка, который идет после ul для курсов валют и гео(общий)

    this.wrapperForGeo = document.createElement("div");
    this.wrapperForGeo.classList.add("wrapperForGeo"); //Див обертка для гео(внутри общей обертки сосед обертки для курса валют)

    this.geoHeader = document.createElement("h3");
    this.geoHeader.classList.add("geoHeader"); // загловок 'your city'
    this.geoHeader.innerText = "Your city";

    this.geoContentOne = document.createElement("div");
    this.geoContentOne.classList.add("geoContentOne"); //Див для гео контента первый (внутри обертки для гео)

    this.geoContentTwo = document.createElement("div");
    this.geoContentTwo.classList.add("geoContentTwo"); //Див для гео контента второй (внутри обертки для гео)

    this.wrapperForExchange = document.createElement("div");
    this.wrapperForExchange.classList.add("wrapperForExchange"); // Див обертка для курса валют (внутри общей обертки сосед обертки для гео)

    this.exchHeader = document.createElement("h3");
    this.exchHeader.classList.add("exchHeader");
    this.exchHeader.innerText = "Exchange Course "; // Загловок курса валют

    this.exchangeContentUSD = document.createElement("div");
    this.exchangeContentUSD.classList.add("exchangeContentUSD"); //Див для контента курса валют USD (внутри обертки для курсов валют)

    this.exchangeContentEUR = document.createElement("div");
    this.exchangeContentEUR.classList.add("exchangeContentEUR"); //Див для контента курса валют UAH (внутри обертки для курсов валют)
  }

  initRenederGeoExchange() {
    this.wrapperForExchange.append(this.exchHeader, this.exchangeContentUSD, this.exchangeContentEUR);
    this.wrapperForGeo.append(this.geoHeader, this.geoContentOne, this.geoContentTwo);
    this.wrapperForGeoExchange.append(this.wrapperForGeo, this.wrapperForExchange);
    this.mainBlock.append(this.wrapperForGeoExchange);
  }

  renderGeoWeather(name, temp, clouds, windSpeed) {
    this.geoContentOne.innerHTML = name; // здесь можешь добавлять стили, вписывая элементы html и присваявая им классы. Это название города по геолокации
    this.geoContentTwo.innerHTML = `${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`; //здесь можешь добавлять стили, вписывая элементы html и присваявая им классы. Это данные города по геолокации.
  }

  renderExchangeCourse(buyUSD, saleUSD, buyEUR, saleEUR) {
    this.exchangeContentUSD.innerHTML = `USD: ${buyUSD}/${saleUSD}`; 
    this.exchangeContentEUR.innerHTML = `EUR: ${buyEUR}/${saleEUR}`;
  }
 
}

class Controller { 
  constructor(model, view, viewGeoExchange) {
    this.model = model;
    this.view = view;
    this.viewGeoExchange = viewGeoExchange;
    const loadAllContent = this.loadAllContent.bind(this);
    
  }

  loadAllContent() {
    this.getGeolocation();
    this.getExchangeCourse();
    this.loadListFromStorage();
  }

  loadListFromStorage() {
    this.model.loadList();
  }

  locationNotReceived() {
    this.viewGeoExchange.geoHeader.innerText = 'Unable to retrieve your location';
  }


  locationReceived(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.model.makeWeatherRequest(latitude, longitude);
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => this.locationReceived(position), (position)=>this.locationNotReceived(position));
    } else {
      this.viewGeoExchange.geoHeader.innerText = "There is some problems with your browser";
    }
  }

  getExchangeCourse() {
    this.model.makeExchangeCourseRequest();
    setInterval(()=>this.model.makeExchangeCourseRequest(), 3600000);
  }
  
  addCity() {
    const cities = this.model.cities;
    const inputAdd = this.view.input.value;
    const id = cities.length ? cities.length : 0;
    if (inputAdd !== "") {
    this.model.addCityToList(inputAdd, id);
    }
  }

  clearList() {
    this.view.listOfCities.innerHTML = "";
    this.model.cities.length = 0;
    this.model.save();
  }

  showEdit(buttonEdit) {
    const wrapperForshow = buttonEdit.nextElementSibling;
    wrapperForshow.classList.toggle("show");
  }

  editCity(buttonSaveEditions) {
    const inputForSaveEdit = buttonSaveEditions.previousElementSibling;
    let newCityName = inputForSaveEdit.value;
    const newCityLi = buttonSaveEditions.closest("li");
    const newCityDiv = newCityLi.firstElementChild;
    const wrapper = buttonSaveEditions.parentElement;
    const cityId = parseInt(buttonSaveEditions.dataset.id);
    if (newCityName == "") {
      wrapper.classList.toggle("show");
    } else {
      this.model.editCityInList(newCityName, newCityDiv, cityId);
      wrapper.classList.toggle("show");
    }
  }


  deleteCity(buttonDelete) {
    const cityId = parseInt(buttonDelete.dataset.id);
    this.model.deleteCityFromArr(cityId, this.model.cities);
    this.view.listOfCities.innerHTML = "";
    this.model.deleteCityFromList(this.model.cities);
  }


  addHandle() {
    document.addEventListener("DOMContentLoaded", () => this.loadAllContent());

    this.view.addCityButton.addEventListener("click", () => this.addCity());

    this.view.clearListofCitiesButton.addEventListener("click", () => this.clearList());

    this.view.listOfCities.addEventListener("click", (ev) => {
      const targetButtonEdit = ev.target;
      const actionEdit = ev.target.dataset.action;
      if (actionEdit === "edit") {
        this.showEdit(targetButtonEdit);
      }  
    });

    this.view.listOfCities.addEventListener("click", (ev) => {
      const targetButtonDel = ev.target;
      const actionDel = ev.target.dataset.action;
      if (actionDel === "delete") {
        this.deleteCity(targetButtonDel);
      }  
    });

    this.view.listOfCities.addEventListener("click", (ev) => {
      const saveEditButton = ev.target;
      const actionSave = ev.target.dataset.action;
      if (actionSave === "saveedit") {
        this.editCity(saveEditButton);
      }
    });
  }
}

class Model {
  constructor(view, viewGeoExchange) {
    this.view = view;
    this.viewGeoExchange = viewGeoExchange;

    if(localStorage.getItem("cities") !== null) {
      this.cities = JSON.parse(localStorage.getItem("cities"));
  } else {
      this.cities = [];
    }  
  }

  save() {  
    localStorage.setItem("cities", JSON.stringify(this.cities));
}

  loadList() {
    this.cities.forEach(item => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${item.cityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
      .then(response =>response.json())
      .then(response => {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.view.renderListOfCities(name, item.id, temp, clouds, windSpeed);
      })
      .catch(err => {
        this.view.input.value = `Oops...You have mistake. Status${err.status}. Try again`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 3000);
      });
      this.view.input.value = '';
    });
  }

  makeWeatherRequest(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => response.json())
    .then(response => {
      const temp = parseInt(response.main.temp - 273.15);
      const clouds = response.weather[0].description;
      const windSpeed = parseInt(response.wind.speed);
      const name = response.name;
      this.viewGeoExchange.renderGeoWeather(name, temp, clouds, windSpeed);
    })
    .catch(err => {
      this.view.viewGeoExchange.geoHeader.innerText = `Oops...You have mistake. Status${err.status}. Try again`;
      setTimeout(()=>{
        this.view.viewGeoExchange.geoHeader.innerText ="";
      }, 3000);
    }); 
  }

makeExchangeCourseRequest() {
  fetch(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
  .then(response => response.json())
  .then(response =>{
    const buyUSD = Math.round(parseFloat(response[0].buy)*100) / 100;
    const saleUSD = Math.round(parseFloat(response[0].sale)*100) / 100;
    const buyEUR = Math.round(parseFloat(response[1].buy)*100) / 100;
    const saleEUR = Math.round(parseFloat(response[1].sale)*100) / 100;
    this.viewGeoExchange.renderExchangeCourse(buyUSD, saleUSD, buyEUR, saleEUR);
  })
  .catch(err => {
    this.view.viewGeoExchange.exchHeader.innerText = `Oops...You have mistake. Status${err.status}. Try again`;
    setTimeout(()=>{
      this.view.viewGeoExchange.exchHeader.innerText ="";
    }, 3000);
  });
}

  addCityToArr(name, id) {
    const city = {
      id,
      cityName:name
    };
    this.cities.push(city);
    this.save();
  }
  

  addCityToList(inputAdd, id) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputAdd}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => response.json())
    .then(response => {
      if (response.cod === "404") {
        this.view.input.value = `Oops...${response.message}!`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 3000);
      } else {
      const temp = parseInt(response.main.temp - 273.15);
      const clouds = response.weather[0].description;
      const windSpeed = parseInt(response.wind.speed);
      const name = response.name;
      this.view.renderListOfCities(name, id, temp, clouds, windSpeed);
      this.addCityToArr(name, id);
      }
    })
    .catch(err => {
      this.view.input.value = `Oops...You have mistake. Status${err.status}. Try again`;
      setTimeout(()=>{
        this.view.input.value ="";
      }, 3000);
    });
    this.view.input.value = '';
  }

  deleteCityFromArr(cityId) {
    const idx = this.cities.findIndex((item) => {
      return item.id === cityId;
    });
    this.cities.splice(idx, 1);
    this.save();
    
  }

  deleteCityFromList(arrOfCities) {
    arrOfCities.forEach(item => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${item.cityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
      .then( response => response.json())
      .then(response => {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.view.renderListOfCities(name, item.id, temp, clouds, windSpeed);
      });
    });
  }

  editCityInArr(cityId, cityName) {
    const idx = this.cities.findIndex((item) => {
      return item.id === cityId;
    });
    if (cityName !== "") {
    const newCity = {
      id : cityId,
      cityName
    };
    this.cities.splice(idx, 1, newCity);
    this.save();
    }
  }

  editCityInList(newCityName, newCityDiv, cityId) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newCityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => response.json())
    .then(response => {
      if (response.cod === "404") {
        this.view.input.value = `Oops...${response.message}!`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 3000);
      } else {
      const temp = parseInt(response.main.temp - 273.15);
      const clouds = response.weather[0].description;
      const windSpeed = parseInt(response.wind.speed);
      const name = response.name;
      this.editCityInArr(cityId, name);
      newCityDiv.innerHTML = `${name} <br>                    
      ${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`; //вот здесь див после изменения города. В innerHTML его внутренности
      }
    })
    .catch(err => {
      this.view.inpnt.value = `Oops...You have mistake. Status${err.status}. Try again`;
      setTimeout(()=>{
        this.view.inpnt.value ="";
      }, 3000);
    });
  }
}


  const view = new View();
  const viewGeoExchange = new ViewGeoExchange();
  const model = new Model(view, viewGeoExchange);
  const controller = new Controller(model, view, viewGeoExchange);
  view.initReneder();
  viewGeoExchange.initRenederGeoExchange();
  controller.addHandle();



  

