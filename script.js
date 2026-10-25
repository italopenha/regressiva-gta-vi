const MODO_TESTE = true
const DURACAO_GLITCH = 1500
const LIMITE_CONTAGEM_FINAL = 10_000

// A construção numérica mantém a meia-noite no horário local de cada visitante.
const DATA_LANCAMENTO = MODO_TESTE
    ? new Date(Date.now() + 15_000)
    : new Date(2026, 10, 19, 0, 0, 0)

const elementos = {
    dias: document.getElementById("dias"),
    horas: document.getElementById("horas"),
    minutos: document.getElementById("minutos"),
    segundos: document.getElementById("segundos"),
    label: document.getElementById("countdown-label"),
    segundosContainer: document.querySelector(".countdown-seconds"),
    launchScreen: document.getElementById("launch-screen"),
    anuncio: document.getElementById("launch-announcement")
}

const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
let intervalo = null
let lancamentoIniciado = false
let ultimoSegundo = null

function formatarNumero(valor) {
    return String(Math.max(0, valor)).padStart(2, "0")
}

function atualizarNumeros(tempoRestante) {
    const dias = Math.floor(tempoRestante / 86_400_000)
    const horas = Math.floor((tempoRestante / 3_600_000) % 24)
    const minutos = Math.floor((tempoRestante / 60_000) % 60)
    const segundos = Math.floor((tempoRestante / 1_000) % 60)

    elementos.dias.textContent = formatarNumero(dias)
    elementos.horas.textContent = formatarNumero(horas)
    elementos.minutos.textContent = formatarNumero(minutos)
    elementos.segundos.textContent = formatarNumero(segundos)

    if (document.body.classList.contains("countdown-final") && segundos !== ultimoSegundo) {
        elementos.segundosContainer.classList.remove("tick")
        void elementos.segundosContainer.offsetWidth
        elementos.segundosContainer.classList.add("tick")
    }

    ultimoSegundo = segundos
}

function ativarContagemFinal() {
    if (document.body.classList.contains("countdown-final")) return
    document.body.classList.add("countdown-final")
    elementos.label.textContent = "Prepare-se"
}

function mostrarModoPosLancamento() {
    document.body.classList.remove("launching", "countdown-final")
    document.body.classList.add("post-launch")
    elementos.launchScreen.setAttribute("aria-hidden", "false")
    elementos.anuncio.textContent = "A espera acabou. Bem-vindo de volta a Vice City."
}

function iniciarLancamento() {
    if (lancamentoIniciado) return
    lancamentoIniciado = true

    if (intervalo !== null) {
        clearInterval(intervalo)
        intervalo = null
    }

    atualizarNumeros(0)

    if (movimentoReduzido.matches) {
        mostrarModoPosLancamento()
        return
    }

    document.body.classList.add("launching")
    window.setTimeout(mostrarModoPosLancamento, DURACAO_GLITCH)
}

function regressiva() {
    const tempoRestante = DATA_LANCAMENTO.getTime() - Date.now()

    if (tempoRestante <= 0) {
        iniciarLancamento()
        return
    }

    atualizarNumeros(tempoRestante)

    if (tempoRestante <= LIMITE_CONTAGEM_FINAL) {
        ativarContagemFinal()
    }
}

function iniciarContagem() {
    regressiva()
    if (!lancamentoIniciado) {
        intervalo = window.setInterval(regressiva, 1000)
    }
}

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !lancamentoIniciado) regressiva()
})

if (Date.now() >= DATA_LANCAMENTO.getTime()) {
    lancamentoIniciado = true
    mostrarModoPosLancamento()
} else {
    iniciarContagem()
}
