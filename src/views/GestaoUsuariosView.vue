<template>
  <div class="d-flex justify-content-center align-items-center w-100 vh-100">
    <div class="col-10">
      <TituloPagina
        titulo="Gestão de usuários"
        link="/home"
      />
      <hr>
      <div class="container-fluid" style="height: 40rem; overflow-y: scroll">
        <table class="table table-light table-striped table-hover">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th>Matricula</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, index) in data" :key="usuario.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ usuario.matricula }}</td>
              <td>{{ usuario.nome }}</td>
              <td>{{ usuario.email }}</td>
              <td><i :class="['fa-solid', usuario.ativo ? 'fa-check' : 'fa-xmark']"></i></td>
              <td>
                <div class="dropdown">
                  <button class="btn btn-outline-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ...
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <button class="dropdown-item" @click="activateUser(usuario.id)">
                        <i :class="['fa-solid', usuario.ativo ? 'fa-xmark' : 'fa-check']"></i> Ativar/Inativar
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal_edicao" @click="fetchingUser(usuario.id)">
                        <i class="fa-solid fa-pen"></i> Editar
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" @click="deleteUser(usuario.id)">
                        <i class="fa-solid fa-trash"></i> Excluir
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modal_edicao" tabindex="-1" aria-labelledby="modal_edicao" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal_edicao"><i class="fa-solid fa-pen pe-2"></i>Editar Usuário</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-column gap-2">
            <div class="form-floating">
              <input type="email" class="form-control" id="matricula" placeholder="Matrícula do usuário">
              <label for="matricula">Matrícula do usuário</label>
            </div>
            <div class="form-floating">
              <input type="nome" class="form-control" id="nome" placeholder="Nome completo">
              <label for="nome">Nome completo</label>
            </div>
            <div class="form-floating">
              <input type="email" class="form-control" id="email" placeholder="Email">
              <label for="email">Email</label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="ativo">
              <label class="form-check-label" for="ativo">Ativo</label>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn btn-outline-danger" @click="deleteUser(idusuario)"><i class="fa-solid fa-trash pe-2"></i>Excluir</button>
          <button type="button" class="btn btn-outline-success" @click="updateUser(idusuario)">Salvar alterações<i class="fa-solid fa-pen ps-2"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TituloPagina from "../components/TituloPagina.vue";
import { onMounted, ref } from "vue";

const data = ref([]);
const usuario = ref({});
const idusuario = ref(0);

onMounted(async () => {
  await listar();
});

async function listar() {
  try {
    const response = await fetch('http://localhost:8080/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    let responseData = await response.json();
    data.value = responseData

  } catch (error) {
    console.error('Error fetching usuarios:', error);
  }
};

function fetchingUser(id) {
  usuario.value = data.value.find((user) => user.id === id);

  idusuario.value = usuario.value.id;
  document.getElementById('matricula').value = usuario.value.matricula;
  document.getElementById('nome').value = usuario.value.nome;
  document.getElementById('email').value = usuario.value.email;
  document.getElementById('ativo').checked = usuario.value.ativo;
}

async function updateUser(id) {
  const matricula = document.getElementById('matricula').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const ativo = document.getElementById('ativo').checked;

  const body = JSON.stringify({
    matricula,
    nome,
    email,
    ativo,
  });

  await fetch(`http://localhost:8080/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  alert('Usuário atualizado com sucesso!');
  listar();
}

async function activateUser(id) {
  usuario.value = data.value.find((user) => user.id === id);
  const ativo = !usuario.value.ativo;

  const body = JSON.stringify({
    ativo,
  });

  await fetch(`http://localhost:8080/usuarios/status/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  alert('Usuário ativado/inativado com sucesso!');
  listar();
}

function deleteUser(id) {
  fetch(`http://localhost:8080/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
});

  alert('Usuário excluído com sucesso!');
  listar();
}

</script>