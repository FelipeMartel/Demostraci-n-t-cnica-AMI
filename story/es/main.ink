// AMI · El mensaje que nadie vio completo — guion de prueba (ES)
// Convenciones:
//   "Nombre: texto"      → línea con personaje que habla
//   # escena: <id>       → cambia el fondo
//   # ami: <expresión>   → neutral | feliz | preocupada | pensativa
//   # pausa: <CÓDIGO>    → pausa física; se reanuda con la palabra clave del docente

VAR pistas = 0
VAR precipitado = false

-> capitulo1

=== capitulo1 ===
# escena: patio
# ami: feliz
AMI: ¡Hola! Soy AMI. Hoy vamos a investigar juntos.
# ami: pensativa
AMI: Alguien ha enviado un vídeo al grupo de clase. Dura solo ocho segundos y todo el mundo está comentando.
Leo: ¡Mirad! Parece que Sara ha roto el mural del pasillo.
AMI: ¿Qué hacemos con este mensaje?
* [Reenviarlo al resto de la clase]
    -> c1_compartir
* [Preguntar quién lo grabó y cuándo]
    -> c1_fuente

=== c1_compartir ===
~ precipitado = true
# ami: preocupada
AMI: Vaya... el vídeo ya ha llegado a veinte personas. Y todavía no sabemos qué pasó antes de esos ocho segundos.
-> c1_pausa

=== c1_fuente ===
~ pistas += 1
# ami: feliz
AMI: ¡Buena pregunta! Saber quién grabó el vídeo y cuándo es una pista importante.
-> c1_pausa

=== c1_pausa ===
# ami: pensativa
AMI: Antes de decidir, necesitamos más información. En vuestra mesa hay tarjetas con pistas. # pausa: LUPA42
# ami: feliz
AMI: ¡Gran trabajo, equipo! Con lo que habéis descubierto, el vídeo ya no parece tan claro.
-> capitulo2

=== capitulo2 ===
# escena: aula
# ami: neutral
AMI: Capítulo 2. [Pendiente del guion base de Hero4Help]
-> capitulo3

=== capitulo3 ===
# escena: pasillo
# ami: neutral
AMI: Capítulo 3. [Pendiente del guion base de Hero4Help]
{ precipitado:
    AMI: Hoy hemos aprendido que reenviar un mensaje incompleto puede hacer daño.
- else:
    AMI: Hoy hemos aprendido que preguntar antes de compartir nos ayuda a entender lo que pasó.
}
AMI: Habéis encontrado {pistas} pista(s) digitales.
-> END
