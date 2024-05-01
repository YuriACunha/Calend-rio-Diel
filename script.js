// Seleciona o elemento HTML com a classe "calendar"
const calendar = document.querySelector(".calendar");

// Seleciona o elemento HTML com a classe "date"
const date = document.querySelector(".date");

// Seleciona o elemento HTML com a classe "days"
const daysContainer = document.querySelector(".days");

// Seleciona o elemento HTML com a classe "prev"
const prev = document.querySelector(".prev");

// Seleciona o elemento HTML com a classe "next"
const next = document.querySelector(".next");

// Seleciona o elemento HTML com a classe "today-btn"
const todayBtn = document.querySelector(".today-btn");

// Seleciona o elemento HTML com a classe "goto-btn"
const gotoBtn = document.querySelector(".goto-btn");

// Seleciona o elemento HTML com a classe "date-input"
const dateInput = document.querySelector(".date-input");

// Seleciona o elemento HTML com a classe "event-day"
const eventDay = document.querySelector(".event-day");

// Seleciona o elemento HTML com a classe "event-date"
const eventDate = document.querySelector(".event-date");

// Seleciona o elemento HTML com a classe "events"
const eventsContainer = document.querySelector(".events");

// Seleciona o elemento HTML com a classe "add-event"
const addEventBtn = document.querySelector(".add-event");

// Seleciona o elemento HTML com a classe "add-event-wrapper"
const addEventWrapper = document.querySelector(".add-event-wrapper ");

// Seleciona o elemento HTML com a classe "close"
const addEventCloseBtn = document.querySelector(".close ");

// Seleciona o elemento HTML com a classe "event-name"
const addEventTitle = document.querySelector(".event-name ");

// Seleciona o elemento HTML com a classe "event-time-from"
const addEventFrom = document.querySelector(".event-time-from ");

// Seleciona o elemento HTML com a classe "event-time-to"
const addEventTo = document.querySelector(".event-time-to ");

// Seleciona o elemento HTML com a classe "add-event-btn"
const addEventSubmit = document.querySelector(".add-event-btn ");


// Define a data de hoje
let today = new Date();

// Variável para armazenar o dia ativo (será definido posteriormente)
let activeDay;

// Obtém o mês atual (0 = janeiro, 1 = fevereiro, ..., 11 = dezembro)
let month = today.getMonth();

// Obtém o ano atual (por exemplo, 2022)
let year = today.getFullYear();

// Array de nomes dos meses em português
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Array para armazenar os eventos (será populado a partir do armazenamento local)
const eventsArr = [];

// Função para obter os eventos do armazenamento local
getEvents();

// Exibe os eventos presentes no array (apenas para fins de depuração)
console.log(eventsArr);
// Função para inicializar o calendário na página
function initCalendar() {
  // Calcula o primeiro dia do mês atual
  const firstDay = new Date(year, month, 1);

  // Calcula o último dia do mês atual
  const lastDay = new Date(year, month + 1, 0);

  // Calcula o último dia do mês anterior
  const prevLastDay = new Date(year, month, 0);

  // Obtém o número de dias do mês anterior
  const prevDays = prevLastDay.getDate();

  // Obtém o número de dias do mês atual
  const lastDate = lastDay.getDate();

  // Obtém o dia da semana do primeiro dia do mês atual (0 = domingo, 1 = segunda-feira, ..., 6 = sábado)
  const day = firstDay.getDay();

  // Calcula o número de dias no próximo mês que precisam ser exibidos no calendário atual
  const nextDays = 7 - lastDay.getDay() - 1;

  // Define o texto da data exibida no cabeçalho do calendário (mês e ano)
  date.innerHTML = months[month] + " " + year;

  // String para armazenar os elementos HTML dos dias do calendário
  let days = "";

  // Loop para adicionar os dias do mês anterior (dias passados)
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Loop para adicionar os dias do mês atual
  for (let i = 1; i <= lastDate; i++) {
    // Verifica se há um evento neste dia
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    // Verifica se o dia é o dia de hoje
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      // Define o dia como ativo
      activeDay = i;

      // Obtém informações sobre o dia ativo
      getActiveDay(i);

      // Atualiza os eventos para o dia ativo
      updateEvents(i);

      // Verifica se há um evento neste dia e adiciona classes adequadas
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      // Verifica se há um evento neste dia e adiciona classes adequadas
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  // Loop para adicionar os dias do próximo mês
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  // Define o conteúdo HTML dos dias no container de dias do calendário
  daysContainer.innerHTML = days;

  // Adiciona os ouvintes de evento aos dias do calendário
  addListner();
}

// Função para avançar para o mês anterior
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar(); // Atualiza o calendário para exibir o mês anterior
}

// Função para avançar para o próximo mês
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar(); // Atualiza o calendário para exibir o próximo mês
}

// Adiciona ouvintes de evento aos botões de navegação (prev e next)
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Inicializa o calendário ao carregar a página
initCalendar();

// Função para adicionar o evento 'active' ao dia selecionado
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML); // Atualiza o dia ativo
      updateEvents(Number(e.target.innerHTML)); // Atualiza os eventos para o dia selecionado
      activeDay = Number(e.target.innerHTML);

      // Remove a classe 'active' de todos os dias
      days.forEach((day) => {
        day.classList.remove("active");
      });

      // Verifica se o dia clicado é do mês anterior ou próximo para mudar de mês
      if (e.target.classList.contains("prev-date")) {
        prevMonth(); // Avança para o mês anterior
        // Adiciona a classe 'active' ao dia clicado após a mudança de mês
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth(); // Avança para o próximo mês
        // Adiciona a classe 'active' ao dia clicado após a mudança de mês
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active"); // Adiciona a classe 'active' ao dia clicado
      }
    });
  });
}

// Botão 'Hoje': volta para o mês atual
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar(); // Atualiza o calendário para exibir o mês atual
});

// Atualiza a formatação do campo de entrada de data (mm/yyyy)
dateInput.addEventListener("input", (e) => {
  // Remove caracteres não numéricos, exceto a barra '/'
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

  // Adiciona automaticamente a barra '/' após o mês (se o usuário digitar apenas dois dígitos)
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }

  // Limita a entrada ao formato mm/yyyy (mês com 1 ou 2 dígitos, ano com 4 dígitos)
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }

  // Trata o evento de exclusão (backspace) para remover a barra '/' extra se excluída
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

// Botão 'Ir': navega para a data especificada pelo usuário
gotoBtn.addEventListener("click", gotoDate);

// Função para navegar para a data especificada pelo usuário
function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      // Atualiza o mês e o ano com base na entrada do usuário
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar(); // Atualiza o calendário para exibir o mês e ano especificados
      return;
    }
  }
  alert("Data Inválida"); // Exibe alerta se a data especificada for inválida
}

// Função para obter o dia ativo, o nome do dia e a data e atualizar o evento e a data do evento
function getActiveDay(date) {
  let day = new Date(year, month, date); // Cria um objeto de data para o dia selecionado
  let dayName = day.toString().split(" ")[0]; // Obtém o nome do dia da semana

 // Criamos uma variável para armazenar o valor que recebemos e substituimos o valor recebido com, IF/Else
  let diaSemana;

  if (dayName === "Mon")
    diaSemana = "Seg"
  else if (dayName === "Tue")
    diaSemana = "Ter"
    else if (dayName === "Wed")
    diaSemana = "Qua"
    else if (dayName === "Thu")
    diaSemana = "Qui"
    else if (dayName === "Fri")
    diaSemana = "Sex"
    else if (dayName === "Sat")
    diaSemana = "Sab"
    else if (dayName === "Sun")
    diaSemana = "Dom"
  eventDay.innerHTML = diaSemana; // Define o nome do dia no elemento HTML eventDay
  eventDate.innerHTML = date + " " + months[month] + " " + year; // Define a data completa no elemento HTML eventDate
}

// Função para atualizar os eventos quando um dia está ativo
function updateEvents(date) {
  let events = ""; // String para armazenar os eventos formatados em HTML

  // Itera sobre o array de eventos para encontrar eventos correspondentes ao dia ativo
  eventsArr.forEach((event) => {
    if (
      date === event.day && // Verifica se o dia do evento corresponde ao dia ativo
      month + 1 === event.month && // Verifica se o mês do evento corresponde ao mês ativo (adiciona +1 porque o método getMonth() retorna valores de 0 a 11)
      year === event.year // Verifica se o ano do evento corresponde ao ano ativo
    ) {
      // Itera sobre os eventos do dia ativo e cria o HTML correspondente para cada evento
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });

  // Se não houver eventos para o dia ativo, exibe uma mensagem indicando que não há agendamentos
  if (events === "") {
    events = `<div class="no-event">
            <h3>Sem agendamentos</h3>
        </div>`;
  }

  // Define o conteúdo HTML gerado para os eventos no container de eventos (eventsContainer)
  eventsContainer.innerHTML = events;

  // Salva os eventos atualizados (pode ser uma função para persistir os eventos em um banco de dados, por exemplo)
  saveEvents();
}

// Adiciona ou remove a classe 'active' ao wrapper de adicionar evento ao clicar no botão de adicionar evento
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

// Remove a classe 'active' do wrapper de adicionar evento ao clicar no botão de fechar
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

// Remove a classe 'active' do wrapper de adicionar evento ao clicar fora do botão de adicionar evento ou do próprio wrapper
document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

// Permite apenas até 50 caracteres no campo de título do evento
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50); // Limita o número máximo de caracteres para 50
});

// Permite apenas a entrada de números e ':' no campo de horário de início do evento
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, ""); // Remove caracteres não permitidos
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":"; // Adiciona ':' automaticamente após os primeiros 2 caracteres
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5); // Limita o número máximo de caracteres para 5 (hh:mm)
  }
});

// Permite apenas a entrada de números e ':' no campo de horário de término do evento
addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, ""); // Remove caracteres não permitidos
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":"; // Adiciona ':' automaticamente após os primeiros 2 caracteres
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5); // Limita o número máximo de caracteres para 5 (hh:mm)
  }
});

// Função para adicionar um evento ao array de eventos (eventsArr) ao clicar no botão de envio do formulário
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  
  // Verifica se todos os campos obrigatórios foram preenchidos
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Preencha todos os campos"); // Exibe um alerta se algum campo estiver vazio
    return;
  }

  // Verifica o formato correto de hora (24 horas) nos campos de horário de início e término
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Horário Inválido"); // Exibe um alerta se o formato do horário for inválido
    return;
  }

  // Converte o horário para o formato desejado (hh:mm)
  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  // Verifica se o evento já foi adicionado para o dia ativo
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });

  if (eventExist) {
    alert("Evento já adicionado"); // Exibe um alerta se o evento já foi adicionado
    return;
  }

  // Cria um novo evento e o adiciona ao array de eventos (eventsArr)
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };

  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  // Limpa os campos do formulário após adicionar o evento com sucesso
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  // Atualiza os eventos para refletir a adição do novo evento
  updateEvents(activeDay);

  // Seleciona o dia ativo e adiciona a classe 'event' se ainda não estiver adicionada
  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl && !activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

// Função para deletar um evento ao clicar nele na seção de eventos
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Tem certeza que quer cancelar esse agendamento?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML; // Obtém o título do evento clicado
      // Itera sobre os eventos para encontrar e remover o evento correspondente
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1); // Remove o evento da lista de eventos
            }
          });
          // Se não houver mais eventos nesse dia, remova-o de eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1); // Remove o dia sem eventos
            // Remove a classe 'event' do dia correspondente na interface
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay); // Atualiza a exibição dos eventos na interface
    }
  }
});

// Função para salvar os eventos no armazenamento local (local storage)
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr)); // Converte e salva eventsArr como string JSON
}

// Função para obter os eventos salvos do armazenamento local (local storage)
function getEvents() {
  // Verifica se os eventos já foram salvos no local storage e os carrega para eventsArr
  if (localStorage.getItem("events") === null) {
    return; // Retorna se não houver eventos salvos
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events"))); // Carrega os eventos do armazenamento local para eventsArr
}

// Função para converter o formato de hora para 12 horas com AM/PM
function convertTime(time) {
  let timeArr = time.split(":"); // Divide a string do tempo em um array [hour, minute]
  let timeHour = timeArr[0]; // Obtém a hora
  let timeMin = timeArr[1]; // Obtém os minutos
  let timeFormat = timeHour >= 12 ? "PM" : "AM"; // Determina se é AM ou PM
  timeHour = timeHour % 12 || 12; // Converte a hora para o formato de 12 horas
  time = timeHour + ":" + timeMin + " " + timeFormat; // Formata a hora completa com AM/PM
  return time; // Retorna a hora formatada
}
