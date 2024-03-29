window.Memory = {

  init: function(){
    this.$game = $(".game");
    this.$modal = $(".modal");
    this.$overlay = $(".modal-overlay");
    this.$restartButton = $("button.restart");
    this.cardsArray = $.merge(window.MemoryCards, window.MemoryCards);
    this.shuffleCards(this.cardsArray);
    this.setup();
    this.binding();
  },

  shuffleCards: function(cardsArray){
    this.$cards = $(this.shuffle(this.cardsArray));
  },

  setup: function(){
    this.html = this.buildHTML();
    this.$game.html(this.html);
    this.$memoryCards = $(".card");
    this.paused = false;
    this.guess = null;
  },

  binding: function(){
    this.$memoryCards.on("click", this.cardClicked);
    this.$restartButton.on("click", $.proxy(this.reset, this));
  },

  // kinda messy but hey
  cardClicked: function(){
    var _ = Memory;
    var $card = $(this);
    if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
      $card.find(".inside").addClass("picked");
      if(!_.guess){
        _.guess = $(this).attr("data-id");
      } else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
        $(".picked").addClass("matched");
        _.guess = null;
      } else {
        _.guess = null;
        _.paused = true;
        setTimeout(function(){
          $(".picked").removeClass("picked");
          Memory.paused = false;
        }, 1800);
      }
      if($(".matched").length == $(".card").length){
        _.win();
      }
    }
  },

  win: function(){
    this.paused = true;
    setTimeout(function(){
      Memory.showModal();
      Memory.$game.fadeOut();
    }, 1000);
  },

  showModal: function(){
    this.$overlay.show();
    this.$modal.fadeIn("slow");
  },

  hideModal: function(){
    this.$overlay.hide();
    this.$modal.hide();
  },

  reset: function(){
    this.hideModal();
    this.shuffleCards(this.cardsArray);
    this.setup();
    this.$game.fadeIn("slow");
    this.binding();
  },

  // Fisher-Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
  shuffle: function(array){
    var counter = array.length, temp, index;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
  },

  buildHTML: function(){
    var frag = '';
    this.$cards.each(function(k, v) {
      frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
      <div class="front"><img src="'+ v.img +'"/></div>\
      <div class="back"><img src="' + window.MemoryLogotype.replace('{n}', k+1) + '"/></div>\
      </div></div>';
    });
    return frag;
  }
};
