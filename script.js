// Fonction pour démarrer l'accès au micro et détecter le souffle
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let flameIntensity = 1;
    let isExtinguished = false;
    let blowCount = 0; // Compteur de souffles

    // Fonction qui analyse l'intensité du souffle
    function checkForBlow() {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      dataArray.forEach(value => sum += value);
      const average = sum / bufferLength;

      // Si le souffle dépasse un certain seuil (souffle très fort)
      if (average > 150 && !isExtinguished) {
        blowCount++;  // Compter le nombre de souffles

        // Si le souffle est assez fort, réduire l'intensité de la flamme
        flameIntensity -= 0.1;  
        document.getElementById("flame").style.transform = `translateX(-50%) scale(${flameIntensity}) rotate(${Math.random() * 10 - 5}deg)`;
        document.getElementById("flame").style.opacity = flameIntensity;
        
        // Si plusieurs souffles sont détectés, éteindre la bougie
        if (blowCount >= 3 && flameIntensity <= 0.2) {
          isExtinguished = true;
          document.getElementById("flame").classList.add("hidden");
          document.getElementById("message").textContent = "La bougie est éteinte ! Joyeux anniversaire !";
        } else {
          document.getElementById("message").textContent = `Souffle encore ! (${3 - blowCount} souffles restants)`;
        }
      } else if (flameIntensity < 1 && !isExtinguished) {
        flameIntensity += 0.02;  // Rétablir la flamme progressivement
        document.getElementById("flame").style.transform = `translateX(-50%) scale(${flameIntensity}) rotate(${Math.random() * 10 - 5}deg)`;
        document.getElementById("flame").style.opacity = flameIntensity;
      }
    }

    function animate() {
      checkForBlow();
      requestAnimationFrame(animate);
    }

    animate();
  })
  .catch(function(err) {
    console.log('Erreur d\'accès au micro: ' + err);
  });
