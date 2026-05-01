async function iniciarCarruselAnimado() {
    const frame = document.getElementById('carrusel-frame');
    
    try {
        // 1. Cargar configuración
        const respuesta = await fetch(`config.txt?t=${Date.now()}`);
        const texto = await respuesta.text();
        
        // 2. Parsear datos
        const lineas = texto.trim().split('\n');
        const config = lineas.map(linea => {
            const [url, tiempo] = linea.split(',');
            return { url: url.trim(), tiempo: parseInt(tiempo.trim()) };
        });

        // 3. Crear slides en el DOM
        config.forEach((item, index) => {
            const div = document.createElement('div');
            // La primera imagen empieza ya activa
            div.className = `slide ${index === 0 ? 'active' : ''}`;
            // Timestamp para evitar caché de GitHub Pages
            div.style.backgroundImage = `url('${item.url}?t=${Date.now()}')`;
            frame.appendChild(div);
        });

        const slides = document.querySelectorAll('.slide');
        let indiceActual = 0;
        let duracionAnimacion = 800; // Debe coincidir con el CSS (0.8s)

        // 4. Función de rotación con animaciones
        function cambiarSlide() {
            // A. Identificar la imagen que sale
            const slideQueSale = slides[indiceActual];
            
            // B. Identificar la imagen que entra
            indiceActual = (indiceActual + 1) % slides.length;
            const slideQueEntra = slides[indiceActual];

            // C. Ejecutar movimiento
            slideQueSale.classList.remove('active');
            slideQueSale.classList.add('exit'); // Inicia animación hacia la izquierda
            
            slideQueEntra.classList.add('active'); // Inicia animación desde la derecha

            // D. Limpieza: Después de que termine la animación, quitar la clase 'exit'
            // para mover la imagen silenciosamente de vuelta a la derecha (transform: 100%)
            setTimeout(() => {
                slideQueSale.classList.remove('exit');
            }, duracionAnimacion); 

            // E. Programar el siguiente cambio con el tiempo variable
            setTimeout(cambiarSlide, config[indiceActual].tiempo);
        }

        // Iniciar ciclo
        setTimeout(cambiarSlide, config[0].tiempo);

    } catch (e) {
        console.error("Error en carrusel:", e);
    }
}

iniciarCarruselAnimado();