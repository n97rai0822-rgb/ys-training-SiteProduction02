'use strict';

// インポート
import Swiper from 'swiper';
import { Navigation, Pagination , Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ====================
ハンバーガーメニュー
====================*/
const headerMenu = document.querySelector('.header__menu');
const hamburger = document.querySelector('.header__menu--hamburger');

headerMenu.addEventListener('click',()=>{
    hamburger.classList.toggle('active');
});


/* ====================
スムーススクロール
====================*/
// 「#」から始まるhref属性をもつaタグ要素をすべて取得
const InPageLinks = document.querySelectorAll('a[href^="#"]');

// 取得した要素に繰り返し処理を行う
InPageLinks.forEach((link) =>{
    // 要素がクリックされたときのイベント
    link.addEventListener('click',(event) =>{
        // ブラウザがデフォルトで持っている動作を止める
        event.preventDefault();

        // href属性の値を取得する
        const targetId = link.getAttribute('href');

        // 移動先となる要素を取得する
        const targetElem = document.querySelector(targetId);

        targetElem.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});


/* ====================
改行のレスポンシブ対応
====================*/
const spBr = document.querySelectorAll('.spBr');
const pcBr = document.querySelectorAll('.pcBr');

// 画面に幅に応じてクラスのつけ外しを行い、改行を切り替える
const changeBr = () => {
    const isSp = window.innerWidth < 768 ;

    spBr.forEach((item)=>{
        item.classList.toggle('showBr' , isSp);
        item.classList.toggle('hideBr', !isSp);
    });

    pcBr.forEach((item)=>{
        item.classList.toggle('showBr' , !isSp);
        item.classList.toggle('hideBr', isSp);
    });
}

window.addEventListener('DOMContentLoaded' , changeBr);
window.addEventListener('resize' , changeBr)


/* ====================
スライダー
====================*/
let swiper = null;

// swiperを生成する関数
const createSwiper = () => {
    swiper = new Swiper('.swiper',{
        modules: [Navigation, Pagination, Autoplay],
        // オプション
        // loop: true,
        rewind: true,
        speed: 1000, //切り替わる速さ
        slidesPerView:1.3,  //一度に表示する枚数
        spaceBetween:16, //スライド間の間隔
        centeredSlides:true, //アクティブなスライドを中央配置
        autoplay: {
            delay: 2000, //自動再生の間隔
            disableOnInteraction:false, //矢印をクリックしても自動再生を止めない
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
};

// swiperを削除する関数
const destroySwiper = () => {
    if (swiper !== null) {
        swiper.destroy(true, true);
        swiper = null;
    }
};

// ブレイクポイントを判定する関数
const swiperResponsive = () =>{
    if(window.innerWidth < 768 && swiper == null){
        createSwiper();
    }else if(window.innerWidth >= 768 && swiper !== null) {
        destroySwiper();
    }
}

window.addEventListener('load', swiperResponsive);
window.addEventListener('resize', swiperResponsive);


/* ====================
入力フォームバリデーション
====================*/
const form = document.querySelector('.form');
const inputs = document.querySelectorAll(".inputGroup__input");
const agreeCheck = document.querySelector(".checkbox");
const formBtn = document.querySelector(".form__btn");

// バリデーションルールをオブジェクトにまとめる。
const validationRules = {

    yomigana: {
        regex: /^[ぁ-んー\s]+$/,
        message: "ひらがなで入力してください"
    },

    email: {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "メールアドレスの形式で入力してください"
    },

    tel: {
        regex: /^0\d{1,4}-?\d{1,4}-?\d{4}$/,
        message: "電話番号の形式で入力してください"
    }

};


// 入力欄の判定を行う関数
const isInputValid = (input) =>{

    // 入力内容を取得
    const value = input.value.trim();

    // 空欄の場合
    if(value === ""){
        // 以下のオブジェクトを返す
        return {
            valid: false,
            message: "必須項目です"
        }
    }

    // 項目ごとのバリデーション
    const rule = validationRules[input.name];

    if(rule && !rule.regex.test(value)){
        // 以下のオブジェクトを返す
        return {
            valid: false,
            message: rule.message
        }
    }

    // 入力内容が正しい場合、以下のオブジェクトを返す
    return {
        valid: true,
        message: ""
    }
};


// エラーを表示する関数
const showError = (input , message) =>{
    const inputGroup = input.closest(".inputGroup");
    const error = input.closest(".form__group").querySelector(".form__error");

    error.textContent = message;

    inputGroup.classList.add("is-error");
    inputGroup.classList.remove("is-success");
};


// 入力内容が正しい場合の表示をする関数
const showSuccess = (input) =>{
    const inputGroup = input.closest(".inputGroup");
    const error = input.closest(".form__group").querySelector(".form__error");

    error.textContent = "";

    inputGroup.classList.remove("is-error");
    inputGroup.classList.add("is-success");
};


// スタイルを更新する関数
const validateInput = (input) => {
    // 入力内容の判定結果を取得
    const result = isInputValid(input);

    if(result.valid){// 判定結果がtrueの場合
        showSuccess(input);
    }
    else{ // 判定結果falseの場合
        showError(input, result.message);
    }

    return result.valid;
};


// ボタンの活性・非活性を制御する
const checkForm = () => {
    const isAllValid = [...inputs].every(input => {
        // 入力内容の判定結果を取得
        return isInputValid(input).valid;
    });

    formBtn.disabled = !(isAllValid && agreeCheck.checked);
}


// inputに入力されるたびに判定を行う。
inputs.forEach(input => {

    input.addEventListener("input", () => {
        validateInput(input);
        checkForm();
    });

});


// チェックボックスが変更されるたびにフォーム全体の判定を行う
agreeCheck.addEventListener("change", checkForm);


// 送信ボタンを押した際に入力状況を最終確認し、送信していも大丈夫か判定する。
form.addEventListener("submit", (e) => {

    // 全項目を表示更新
    inputs.forEach(validateInput);

    // 判定
    const isAllValid = [...inputs].every(input => isInputValid(input).valid);

    if (!isAllValid || !agreeCheck.checked) {
        e.preventDefault();
    }

});


/*


処理段階１
・それぞれのinputのバリデーション
・空欄・・・必須項目です
　よみがな欄・・・ひらがなで入力してください。
　メールアドレス・・・メールアドレスの形式で入力してください。
　電話番号・・・電話番号の形式で入力してください。

・inputGroupにクラスをつけ外す
　・エラーメッセージがあれば、is-errorをつける
　・エラーメッセージがなければ、is-successをつける
　クラスはどちらか一方のみがつくように制御。スタイルがバッティングしないように。


処理段階２
・エラーメッセージがない　&& チェックボックスがチェックされている。
　→送信ボタンを活性化




*/