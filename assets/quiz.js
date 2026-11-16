/* =========================================================================
   Quiz widget
   Markup contract:
     <div data-quiz>
       <div data-question>
         <div data-options>
           <button data-option data-correct="true|false">…</button>
         </div>
         <p data-feedback aria-live="polite"></p>
         <p data-explanation hidden>…</p>
       </div>
       <button data-quiz-reset>Reset</button>
     </div>
   Options are shuffled on load and on reset.
   ========================================================================= */

(() => {
  const shuffle = (items) => {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const questions = [...quiz.querySelectorAll("[data-question]")];

    questions.forEach((question) => {
      const optionList = question.querySelector("[data-options]");
      if (!optionList) return;

      const options = [...optionList.querySelectorAll("[data-option]")];
      const feedback = question.querySelector("[data-feedback]");
      const explanation = question.querySelector("[data-explanation]");

      const shuffleOptions = () => {
        shuffle(options).forEach((option) => optionList.appendChild(option));
      };

      const resetQuestion = () => {
        question.dataset.answered = "false";
        options.forEach((option) => {
          option.disabled = false;
          option.classList.remove("is-correct", "is-wrong", "is-muted");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("is-correct", "is-wrong");
        }
        if (explanation) explanation.hidden = true;
      };

      shuffleOptions();
      resetQuestion();

      options.forEach((option) => {
        option.addEventListener("click", () => {
          if (question.dataset.answered === "true") return;
          question.dataset.answered = "true";

          const isCorrect = option.dataset.correct === "true";

          options.forEach((candidate) => {
            candidate.disabled = true;
            if (candidate.dataset.correct === "true") {
              candidate.classList.add("is-correct");
            } else {
              candidate.classList.add("is-muted");
            }
          });

          if (!isCorrect) option.classList.add("is-wrong");

          if (feedback) {
            feedback.textContent = isCorrect
              ? "Correct — that is the right displacement."
              : "Not quite — check the signs and the angle.";
            feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
          }

          if (explanation) explanation.hidden = false;
        });
      });

      question._resetQuizQuestion = resetQuestion;
      question._shuffleQuizOptions = shuffleOptions;
    });

    const resetButton = quiz.querySelector("[data-quiz-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        questions.forEach((question) => {
          if (question._shuffleQuizOptions) question._shuffleQuizOptions();
          if (question._resetQuizQuestion) question._resetQuizQuestion();
        });
      });
    }
  });
})();
