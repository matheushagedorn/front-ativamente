<template>
  <div class="container-fluid d-flex flex-column w-100 vh-100 p-3">
    <TituloPagina
      class="mb-4"
      titulo="Eventos"
      link="/home"
    />
    <div class="d-flex flex-column justify-content-center align-items-center w-100 p-3 flex-grow-1">
      <div class="col-12 col-md-10 w-100 h-100 d-flex flex-column">
        <hr>
        <div class="calendar p-3 mx-auto flex-grow-1 d-flex flex-column">
          <div class="d-flex justify-content-start mb-3">
            <button 
              class="btn btn-primary me-2" 
              :disabled="!selectedDay" 
              @click="openModal"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
            <button 
              class="btn btn-primary me-2" 
              :disabled="!selectedDay || !hasEvent(selectedDay)" 
              @click="editEvent"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button 
              class="btn btn-primary" 
              :disabled="!selectedDay" 
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3 font-weight-bold">
            <button class="btn btn-outline-primary" @click="prevYear"><< </button>
            <button class="btn btn-outline-primary" @click="prevMonth">< </button>
            <button class="btn btn-outline-secondary" @click="goToToday">{{ monthYear }}</button>
            <button class="btn btn-outline-primary" @click="nextMonth"> ></button>
            <button class="btn btn-outline-primary" @click="nextYear"> >></button>
          </div>
          <div class="d-flex flex-wrap flex-grow-1">
            <div class="col-1 p-2 text-center font-weight-bold" v-for="dayName in weekDays" :key="dayName">
              {{ dayName }}
            </div>
            <div class="col-1 p-2 text-center" v-for="blank in blanks" :key="'blank' + blank"></div>
            <button
              class="col-1 p-2 text-center btn"
              :class="{
                'bg-primary text-white': isToday(day),
                'border-secondary': day === selectedDay,
                'has-event': hasEvent(day)
              }"
              v-for="day in days"
              :key="day"
              @click="selectDay(day)"
            >
              {{ day }}
              <span v-if="hasEvent(day)" class="event-indicator"></span>
            </button>
          </div>
          <hr>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true" style="display: none;">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="eventModalLabel"><i class="fa-solid fa-pen pe-2"></i>{{ selectedDay }} de {{ monthYear }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="nomeEvento" placeholder="Nome do Evento" v-model="evento.nomeEvento" required>
                  <label for="nomeEvento">Nome do Evento</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="time" class="form-control" id="dataEvento" placeholder="Data do Evento" v-model="evento.dataEvento" required>
                  <label for="dataEvento">Data do Evento</label>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-floating">
                  <textarea class="form-control" id="descricaoEvento" placeholder="Descrição do Evento" v-model="evento.descricaoEvento" required></textarea>
                  <label for="descricaoEvento">Descrição do Evento</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-floating">
                  <input type="text" class="form-control" id="codigoPostal" placeholder="Código Postal" maxlength="8" v-model="evento.localizacaoEvento.codigoPostal" required>
                  <label for="codigoPostal">CEP</label>
                </div>
              </div>
              <div class="col-md-9">
                <div class="form-floating">
                  <input type="text" class="form-control" id="endereco" placeholder="Endereço" v-model="evento.localizacaoEvento.endereco" required>
                  <label for="endereco">Endereço</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="cidade" placeholder="Cidade" v-model="evento.localizacaoEvento.cidade" required>
                  <label for="cidade">Cidade</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="estado" placeholder="Estado" v-model="evento.localizacaoEvento.estado" required>
                  <label for="estado">Estado</label>
                </div>
              </div>
            </div>
            
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-outline-danger" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-outline-success" @click="submitEvent">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import TituloPagina from "../components/TituloPagina.vue";
import axios from 'axios';
import moment from 'moment';

const currentDate = ref(new Date());
const days = ref([]);
const blanks = ref([]);
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const selectedDay = ref(null);
const eventosCadastrados = ref([]);
const evento = ref({
  nomeEvento: '',
  descricaoEvento: '',
  dataEvento: '',
  localizacaoEvento: {
    endereco: '',
    cidade: '',
    estado: '',
    codigoPostal: ''
  },
  organizadorEvento: {
    nomeOrganizador: '',
    emailOrganizador: '',
    telefoneOrganizador: ''
  },
  participantes: []
});
const participantesInput = ref('');

const updateDays = () => {
  const date = new Date(currentDate.value);
  date.setDate(1);
  const firstDay = date.getDay();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  const lastDate = date.getDate();

  days.value = [];
  for (let i = 1; i <= lastDate; i++) {
    days.value.push(i);
  }

  blanks.value = Array(firstDay).fill('');
};

watch(currentDate, updateDays);

const prevMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() - 1);
  currentDate.value = date;
  selectedDay.value = null;
};

const nextMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() + 1);
  currentDate.value = date;
  selectedDay.value = null;
};

const prevYear = () => {
  const date = new Date(currentDate.value);
  date.setFullYear(date.getFullYear() - 1);
  currentDate.value = date;
  selectedDay.value = null;
};

const nextYear = () => {
  const date = new Date(currentDate.value);
  date.setFullYear(date.getFullYear() + 1);
  currentDate.value = date;
  selectedDay.value = null;
};

const isToday = (day) => {
  const today = new Date();
  const date = new Date(currentDate.value);
  date.setDate(day);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

const hasEvent = (day) => {
  const date = new Date(currentDate.value);
  date.setDate(day);
  const selectedDate = moment(date).format('YYYY-MM-DD');
  return eventosCadastrados.value.some(evento => evento.data === selectedDate);
};

const selectDay = (day) => {
  selectedDay.value = day;
  setEventDate(day);
  getEventoBySelectedDay()
};

const setEventDate = (day) => {
  const date = new Date(currentDate.value);
  date.setDate(day);
  evento.value.dataEvento = moment(date).format('YYYY-MM-DDTHH:mm');
};

const monthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const goToToday = () => {
  currentDate.value = new Date();
  selectedDay.value = null;
  evento.value.dataEvento = moment(currentDate.value).format('YYYY-MM-DDTHH:mm');
};

const openModal = () => {
  document.getElementById('eventModal').classList.add('show');
  document.getElementById('eventModal').style.display = 'block';
  document.body.classList.add('modal-open');
};

const closeModal = () => {
  document.getElementById('eventModal').classList.remove('show');
  document.getElementById('eventModal').style.display = 'none';
  document.body.classList.remove('modal-open');
  resetForm();
};

const submitEvent = async () => {
  try {
    if (!evento.value.dataEvento) {
      alert('Por favor, selecione a data do evento.');
      return;
    }

    evento.value.participantes = participantesInput.value.split(',').map((participante, index) => {
      return {
        idParticipante: `${index + 1}`,
        nomeParticipante: participante.trim(),
        emailParticipante: ''
      };
    });

    console.log('Dados do evento a serem enviados:', evento.value);

    const response = await axios.post('http://localhost:8080/evento', {
      nome: evento.value.nomeEvento,
      descricao: evento.value.descricaoEvento,
      data: evento.value.dataEvento.split('T')[0], // Apenas a data
      hora: parseInt(evento.value.dataEvento.split('T')[1].split(':')[0]), // Apenas a hora
      local: evento.value.localizacaoEvento.endereco,
      valor: 0,
      status: true,
    });

    console.log('Resposta do servidor:', response);

    eventosCadastrados.value.push(evento.value);
    alert('Evento cadastrado com sucesso!');
    closeModal();
    selectedDay.value = null;
    resetForm();
  } catch (error) {
    console.error('Erro ao cadastrar o evento:', error);
    alert('Erro ao cadastrar o evento.');
  }
};

const resetForm = () => {
  evento.value = {
    nomeEvento: '',
    descricaoEvento: '',
    dataEvento: '',
    localizacaoEvento: {
      endereco: '',
      cidade: '',
      estado: '',
      codigoPostal: ''
    },
    organizadorEvento: {
      nomeOrganizador: '',
      emailOrganizador: '',
      telefoneOrganizador: ''
    },
    participantes: []
  };
  participantesInput.value = '';
};

const getEventoBySelectedDay = () => {
  if (!selectedDay.value) return null;

  const date = new Date(currentDate.value);
  date.setDate(selectedDay.value);

  const selectedDate = moment(date).format('YYYY-MM-DD');
  console.log('Data selecionada:', selectedDate);

  const evento = eventosCadastrados.value.find(evento => {
    console.log('Comparando com evento:', evento.id, 'Data do evento:', evento.data);
    return evento.data === selectedDate;
  });

  return evento;
};

const fillEventForm = (evento) => {
  evento.value.nomeEvento = evento.nome;
  evento.value.descricaoEvento = evento.descricao;
  evento.value.dataEvento = moment(`${evento.data}T${evento.hora}:00`).format('YYYY-MM-DDTHH:mm');
  evento.value.localizacaoEvento.endereco = evento.local;
  // Preencha outros campos conforme necessário
  openModal();
};

const editEvent = () => {
  const eventoDoDia = getEventoBySelectedDay();
  if (eventoDoDia) {
    fillEventForm(eventoDoDia);
  } else {
    alert('Nenhum evento encontrado para o dia selecionado');
  }
};

const eventoDoDia = getEventoBySelectedDay();
if (eventoDoDia) {
  console.log('ID do evento:', eventoDoDia.id);
  console.log('Nome do evento:', eventoDoDia.nome);
  // Continue a manipular o evento como desejar
} else {
  console.log('Nenhum evento encontrado para o dia selecionado');
};

const fetchEventos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/evento');
    eventosCadastrados.value = response.data;
    console.log('Eventos cadastrados:', eventosCadastrados.value);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
};

onMounted(() => {
  fetchEventos();
  updateDays();
});

</script>

<style>
.calendar {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.calendar .col-1 {
  width: 14.2857%;
  text-align: center;
}

.font-weight-bold {
  font-weight: bold;
}

.btn {
  border-radius: 5px;
}

.modal-backdrop {
  display: none;
}

.modal {
  display: none;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.15s linear;
}

.modal.show {
  display: block;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 10px;
  pointer-events: none;
}

.modal-content {
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
  pointer-events: auto;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.event-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  top: 5px;
  right: 5px;
}

.has-event {
  position: relative;
}
</style>
