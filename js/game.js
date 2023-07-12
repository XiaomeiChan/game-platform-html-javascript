setGame("1200x600");
game.folder = "assets";
//file gambar yang dipakai dalam game
var gambar = {
  logo: "Logo.png",
  startBtn: "tombolStart.png",
  cover: "Cover.png",
  playBtn: "btn-play.png",
  maxBtn: "maxBtn.png",
  minBtn: "minBtn.png",
  help: "Help.png",
  back: "btnBack.png",
  idle: "Idle.png",
  run: "Run.png",
  jump: "Jump.png",
  fall: "Fall.png",
  hit: "Hit.png",
  tileset: "Terrain.png",
  bg: "Background.png",
  item1: "Apple.png",
  item2: "Bananas.png",
  musuh1Idle: "enemy1Idle.png",
  musuh1Run: "enemy1Run.png",
  musuh1Hit: "enemy1Hit.png",
  bendera: "Flag.png",
};
//file suara yang dipakai dalam game
var suara = {};

//load gambar dan suara lalu jalankan startScreen
loading(gambar, suara, startScreen);

function startScreen() {
  hapusLayar("#99627a");
  tampilkanGambar(dataGambar.logo, 600, 250);
  var startBtn = tombol(dataGambar.startBtn, 600, 350);

  if (tekan(startBtn)) {
    jalankan(halamanCover);
  }
}
function halamanCover() {
  hapusLayar("#99627a");
  gambarFull(dataGambar.cover);
  var playBtn = tombol(dataGambar.playBtn, 1100, 500);
  var howtoPlay = tombol(dataGambar.help, 100, 500);
  if (tekan(playBtn) || game.spasi) {
    if (game.aktif) {
      //mulai game dengan menambahkan transisi
      game.status = "mulai";
      game.level = "1";
      game.score = 0;
      game.warnaTransisi = "#116d6e";
      transisi("out", setAwal);
    }
  }
  // Jika tombol howtoplay ditekan transisi ke halaman (How to Play)
  if (tekan(howtoPlay)) {
    game.warnaTransisi = "#116d6e";
    transisi("out", setHow);
  }
  resizeBtn(1150, 50);
  efekTransisi();
}

// Transisi ke halaman (How to play)
function setHow() {
  transisi("in");
  jalankan(HowtoPlay);
}

// Transisi kembali ke halaman cover
function backHome() {
  transisi("in");
  jalankan(halamanCover);
}

// Halaman (How to play)
function HowtoPlay() {
  hapusLayar("#99627a");
  teks("How to Play", 450, 100, "Cursive-bold-30pt-left-black");
  teks("Right Arrow : Go to Right", 350, 230, "Cursive-bold-30pt-left-black");
  teks("Left Arrow : Go to Left", 350, 330, "Cursive-bold-30pt-left-black");
  teks("Up Arrow : Jump", 350, 430, "Cursive-bold-30pt-left-black");
  teks("Enjoy Playing 👾", 410, 540, "Cursive-bold-30pt-left-black");
  var btnBack = tombol(dataGambar.back, 100, 100);
  if (tekan(btnBack)) {
    game.warnaTransisi = "#116d6e";
    transisi("out", backHome);
  }
  efekTransisi();
}

function setAwal() {
  game.aktif = true;
  game.hero = setSprite(dataGambar.idle, 32, 32);
  game.hero.animDiam = dataGambar.idle;
  game.hero.animJalan = dataGambar.run;
  game.hero.animLompat = dataGambar.jump;
  game.hero.animJatuh = dataGambar.fall;
  game.hero.animMati = dataGambar.hit;
  game.skalaSprite = 2;

  //setPlatform(map_1, dataGambar.tileset, 32, game.hero);
  setPlatform(this["map_" + game.level], dataGambar.tileset, 32, game.hero);
  game.gameOver = ulangiPermainan;

  //set item
  setPlatformItem(1, dataGambar.item1);
  setPlatformItem(2, dataGambar.item2);

  //set enemy
  var musuh1 = {};
  musuh1.animDiam = dataGambar.musuh1Idle;
  musuh1.animJalan = dataGambar.musuh1Run;
  musuh1.animMati = dataGambar.musuh1Hit;
  setPlatformEnemy(1, musuh1);

  //set trigger
  setPlatformTrigger(1, dataGambar.bendera);
  if (game.status == "mulai") {
    game.status = "main";
    mulaiPermainan();
  }
}

function mulaiPermainan() {
  jalankan(gameLoop);
  transisi("in");
}

function ulangiPermainan() {
  setAwal();
  game.aktif = true;
  jalankan(gameLoop);
  game.score = 0;
}

function gameLoop() {
  hapusLayar("#9c9695");
  if (game.kanan) {
    gerakLevel(game.hero, 3, 0);
  } else if (game.kiri) {
    gerakLevel(game.hero, -3, 0);
  }
  if (game.atas) {
    gerakLevel(game.hero, 0, -10);
  }

  latar(dataGambar.bg, 0, 0.5);
  buatLevel();
  cekItem();
  teks(game.score, 550, 60, "Cursive-bold-30pt-left-ungu");
  teks("Level " + game.level, 50, 60, "Cursive-bold-30pt-left-ungu");
  efekTransisi();
}

function cekItem() {
  if (game.itemID > 0) {
    tambahScore(10 * game.itemID);
    game.itemID = 0;
  }
  if (game.musuhID != 0) {
    tambahScore(25);
    game.musuhID = 0;
  }
  if (game.triggerID == 1) {
    game.triggerID = 0;
    game.aktif = false;
    transisi("out", naikLevel);
  }
}

function naikLevel() {
  game.level++;
  if (game.level >= 3) {
    transisi("in");
    jalankan(halamanCover);
  } else {
    game.status = "mulai";
    setAwal();
  }
}
