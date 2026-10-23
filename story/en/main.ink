// AMI · The message nobody saw in full — test script (EN)
// Same knots, variables and tags as story/es/main.ink: keep both files in sync.

VAR pistas = 0
VAR precipitado = false

-> capitulo1

=== capitulo1 ===
# escena: patio
# ami: feliz
AMI: Hi! I'm AMI. Today we're going to investigate together.
# ami: pensativa
AMI: Someone sent a video to the class group. It's only eight seconds long and everyone is talking about it.
Leo: Look! It seems Sara broke the mural in the hallway.
AMI: What should we do with this message?
* [Forward it to the rest of the class]
    -> c1_compartir
* [Ask who recorded it and when]
    -> c1_fuente

=== c1_compartir ===
~ precipitado = true
# ami: preocupada
AMI: Oh no... the video has already reached twenty people. And we still don't know what happened before those eight seconds.
-> c1_pausa

=== c1_fuente ===
~ pistas += 1
# ami: feliz
AMI: Good question! Knowing who recorded the video and when is an important clue.
-> c1_pausa

=== c1_pausa ===
# ami: pensativa
AMI: Before deciding, we need more information. There are clue cards on your table. # pausa: LUPA42
# ami: feliz
AMI: Great work, team! With what you found, the video doesn't look so clear anymore.
-> capitulo2

=== capitulo2 ===
# escena: aula
# ami: neutral
AMI: Chapter 2. [Pending Hero4Help base script]
-> capitulo3

=== capitulo3 ===
# escena: pasillo
# ami: neutral
AMI: Chapter 3. [Pending Hero4Help base script]
{ precipitado:
    AMI: Today we learned that forwarding an incomplete message can hurt someone.
- else:
    AMI: Today we learned that asking before sharing helps us understand what happened.
}
AMI: You found {pistas} digital clue(s).
-> END
