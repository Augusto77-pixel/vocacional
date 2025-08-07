// perguntas e mapeamento
const questions = [
  {
    text: "1. O que você mais gosta de fazer no tempo livre?",
    choices: {
      A: "Ajudar pessoas / cuidar de animais",
      B: "Montar coisas, consertar, mexer em eletrônicos",
      C: "Ler, escrever, conversar sobre temas sociais",
      D: "Desenhar, pintar, dançar, editar vídeos",
      E: "Estar ao ar livre, cuidar de plantas, natureza"
    }
  },
  {
    text: "2. Qual matéria da escola você mais gosta?",
    choices: {
      A: "Biologia ou Química",
      B: "Matemática ou Física",
      C: "História ou Português",
      D: "Artes ou Educação Física",
      E: "Geografia ou Ciências"
    }
  },
  {
    text: "3. Qual dessas atividades você faria com prazer?",
    choices: {
      A: "Participar de um grupo de primeiros socorros",
      B: "Resolver um enigma lógico",
      C: "Produzir um jornal escolar",
      D: "Criar uma coreografia ou desenho",
      E: "Cultivar uma horta escolar"
    }
  },
  {
    text: "4. Você se considera mais:",
    choices: {
      A: "Cuidadoso e empático",
      B: "Racional e lógico",
      C: "Comunicativo e questionador",
      D: "Imaginativo e expressivo",
      E: "Observador e sustentável"
    }
  },
  {
    text: "5. Um desafio que te atrai seria:",
    choices: {
      A: "Salvar vidas ou promover saúde",
      B: "Criar um aplicativo ou jogo",
      C: "Debater ideias e argumentar",
      D: "Fazer uma apresentação artística",
      E: "Preservar o meio ambiente"
    }
  },
  {
    text: "6. Qual profissão mais te chama atenção?",
    choices: {
      A: "Enfermeiro(a), psicólogo(a), veterinário(a)",
      B: "Engenheiro(a), programador(a), arquiteto(a)",
      C: "Professor(a), advogado(a), jornalista",
      D: "Artista, designer, dançarino(a), maquiador(a)",
      E: "Agrônomo(a), biólogo(a), ambientalista"
    }
  },
  {
    text: "7. Você se destaca quando:",
    choices: {
      A: "Alguém precisa de ajuda ou orientação",
      B: "Há problemas que exigem lógica",
      C: "Precisa se comunicar em grupo",
      D: "Pode mostrar sua criatividade",
      E: "Está envolvido com natureza ou sustentabilidade"
    }
  },
  {
    text: "8. Qual ambiente de trabalho te atrai?",
    choices: {
      A: "Hospital, clínica ou abrigo",
      B: "Escritório de engenharia, laboratório",
      C: "Escola, redação ou fórum",
      D: "Estúdios, palcos, moda, design",
      E: "Campo, fazendas, ONGs ambientais"
    }
  },
  {
    text: "9. Você prefere:",
    choices: {
      A: "Trabalhar diretamente com pessoas",
      B: "Trabalhar com computadores e cálculos",
      C: "Falar, escrever e ensinar",
      D: "Criar, inventar e se expressar",
      E: "Cuidar da natureza e dos animais"
    }
  },
  {
    text: "10. Escolha uma frase que mais combina com você:",
    choices: {
      A: "“Quero cuidar e fazer o bem para os outros.”",
      B: "“Gosto de resolver problemas de forma prática.”",
      C: "“Quero usar minha voz para transformar o mundo.”",
      D: "“Vejo beleza e arte em tudo ao meu redor.”",
      E: "“Quero proteger o planeta e viver em harmonia com a natureza.”"
    }
  }
];

const resultMap = {
  A: "Você deve considerar profissões na área da saúde ou cuidado com animais.",
  B: "Você deve considerar profissões na área de engenharia ou tecnologia.",
  C: "Você deve considerar profissões na área de comunicação ou educação.",
  D: "Você deve considerar profissões na área de artes ou design.",
  E: "Você deve considerar profissões na área ambiental ou biológica."
};

const form = document.getElementById('testForm');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultContainer = document.getElementById('result');
const resultTextEl = document.getElementById('resultText');
const resetBtn = document.getElementById('reset');

let current = 0;
const total = questions.length;
let answers = {}; // {0: "A", 1: "B", ...}

function buildQuestion(idx) {
  const q = questions[idx];
  const wrapper = document.createElement('div');
  wrapper.className = 'question';
  wrapper.setAttribute('data-index', idx);
  if (idx === current) wrapper.classList.add('active');

  const p = document.createElement('p');
  p.textContent = q.text;
  wrapper.appendChild(p);

  const opts = document.createElement('div');
  opts.className = 'options';

  for (const key of Object.keys(q.choices)) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q${idx}`;
    input.id = `q${idx}_${key}`;
    input.value = key;
    input.checked = answers[idx] === key;
    input.setAttribute('aria-label', q.choices[key]);

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.textContent = `${key}) ${q.choices[key]}`;

    input.addEventListener('change', () => {
      answers[idx] = input.value;
      if (idx === total - 1) {
        // Ao responder a última pergunta, mostra resultado direto
        computeResult();
      } else {
        showQuestion(idx + 1);
      }
    });

    optionDiv.appendChild(input);
    optionDiv.appendChild(label);
    opts.appendChild(optionDiv);
  }

  wrapper.appendChild(opts);
  return wrapper;
}

function renderAll() {
  form.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const qEl = buildQuestion(i);
    form.appendChild(qEl);
  }
  showQuestion(0);
}

function showQuestion(idx) {
  current = idx;
  document.querySelectorAll('.question').forEach(el => {
    const qIdx = parseInt(el.dataset.index, 10);
    el.style.display = qIdx === idx ? 'block' : 'none';
    el.classList.toggle('active', qIdx === idx);
  });
  progressFill.style.width = `${Math.round(((current) / (total - 1)) * 100)}%`;
  progressText.textContent = `${current + 1} / ${total}`;
}

function computeResult() {
  // conta frequências
  const tally = {};
  Object.values(answers).forEach(v => {
    if (!tally[v]) tally[v] = 0;
    tally[v]++;
  });
  // escolhe maior
  let best = '';
  let max = 0;
  for (const k in tally) {
    if (tally[k] > max) {
      max = tally[k];
      best = k;
    }
  }

  if (!best) {
    resultTextEl.textContent = "Você precisa responder ao menos uma pergunta para obter um resultado.";
  } else {
    resultTextEl.textContent = resultMap[best] || "Resultado indefinido.";
  }
  form.style.display = 'none';
  document.querySelector('.progress-bar').style.display = 'none';
  resultContainer.style.display = 'block';
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

resetBtn.addEventListener('click', () => {
  answers = {};
  current = 0;
  form.style.display = 'block';
  document.querySelector('.progress-bar').style.display = 'flex';
  resultContainer.style.display = 'none';
  renderAll();
});

// inicializa
renderAll();
