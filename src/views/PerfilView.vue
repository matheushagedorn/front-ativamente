<template>
  <div class="d-flex justify-content-center w-100 vh-100">
    <div class="col-10 d-flex flex-column align-items-center mt-5">
      <div class="row mb-2">
        <div class="col-12">
          <div class="border border-4 border-black p-4 rounded-pill bg-dark-subtle">
            <i class="fs-1 fa-solid fa-user"></i> 
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12">
          <h1>
            {{ usuario.nome }}
          </h1>
        </div>
      </div>
      <div class="d-flex flex-column bg-dark-subtle border border-dark border-1 rounded-4 p-4 gap-4 w-50">
        <div class="d-flex flex-column">
          <span class="fs-5 fw-semibold">
            CPF
          </span>
          <span class="fs-6">
            {{ usuario.cpf ?? 'CPF não cadastrado' }}
          </span>
        </div>
        <div class="d-flex flex-column">
          <span class="fs-5 fw-semibold">
            Matrícula
          </span>
          <span class="fs-6">
            {{ usuario.matricula }}
          </span>
        </div>
        <div class="d-flex flex-column">
          <span class="fs-5 fw-semibold">
            Email
          </span>
          <span class="fs-6">
            {{ usuario.email }}
          </span>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4 gap-4">
        <button class="btn btn-danger fs-5 fw-semibold">
          Excluir
        </button>
        <button class="btn btn-warning fs-5 fw-semibold" data-bs-toggle="modal" data-bs-target="#modal_edicao_usuario">
          Editar
        </button>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modal_edicao_usuario" tabindex="-1" aria-labelledby="modal_edicao_usuario" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal_edicao_usuario"><i class="fa-solid fa-pen pe-2"></i>Editar Usuário</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-column gap-2">
            <div class="form-floating">
              <input type="email" class="form-control" id="matricula" placeholder="Matrícula do usuário" :value="usuario.matricula">
              <label for="matricula">Matrícula do usuário</label>
            </div>
            <div class="form-floating">
              <input type="number" class="form-control" id="cpf" placeholder="CPF do usuário" maxlength="11" :value="usuario.cpf">
              <label for="cpf">CPF</label>
            </div>
            <div class="form-floating">
              <input type="nome" class="form-control" id="nome" placeholder="Nome completo" :value="usuario.nome">
              <label for="nome">Nome completo</label>
            </div>
            <div class="form-floating">
              <input type="email" class="form-control" id="email" placeholder="Email" :value="usuario.email">
              <label for="email">Email</label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="ativo" :checked="usuario.ativo">
              <label class="form-check-label" for="ativo">Ativo</label>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn btn-outline-danger" @click="deleteUser(usuario.id)">
            <i class="fa-solid fa-trash pe-2"></i>Excluir
          </button>
          <button type="button" class="btn btn-outline-success" @click="updateUser(usuario.id)">
            Salvar alterações<i class="fa-solid fa-pen ps-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import Swal from 'sweetalert2'

const usuario = ref({});

onMounted(() => {
  if (localStorage.getItem("usuario") === null) {
    router.push({ name: "login" });
  } else {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    usuario.value = usuarioLogado;
    fetchingUser(usuario.id);
  }
});

async function fetchingUser(id) {
  const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  let responseData = await response.json();
  usuario.value = responseData
  console.log(usuario.value)
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

  Swal.fire({
      title: "Usuário alterado!",
      text: "Usuário alterado com sucesso.",
      icon: "success"
  });
}

function deleteUser(id) {
  fetch(`http://localhost:8080/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  Swal.fire({
      title: "Erro ao cadastrar usuário!",
      text: "Verifique se as senhas se coincidem e tente novamente.",
      icon: "error"
  }).then((result) => {
    if (result.isConfirmed) {
        router.push({ name: 'login' });
    }
  });
}

</script>