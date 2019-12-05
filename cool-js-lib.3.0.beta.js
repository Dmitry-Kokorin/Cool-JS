/*!
 * CoolJS JavaScript Library v3.0 Beta
 * https://coolcms.ru
 * https://vk.com/fastgrid
 *
 * Copyright Dmitry Kokorin
 * Released under the MIT license
 * https://coolcms.ru/license
 *
 * Documentation: https://coolcms.ru/docs
 * Date: 2019-08-04T00:00Z
 */
(function (w, d, u) {
	'use strict';
	if (!d.querySelectorAll) {
		alert('Ваш браузер устарел, пожалуйста, обновите браузер чтобы продолжить работу с сайтом');
		return;
	}

	/*
		Вспомогательная функция возвращает свойства с префиксами для браузеров

		element.style[getPrefix(property)]
		@property - HTMLElement property

		UPD 2.8
	*/
	function getPrefix(a){
		const c = a.split('-'), g = ['Moz', 'Webkit', 'Ms'];
		let f = '', gl = g.length;
		if (c.length > 0) for (let i = 0; i < c.length; ++i) f += c[i].substring(0, 1).toUpperCase() + c[i].substring(1).toLowerCase();
		let h = d.createElement('div'), b = f.substring(0, 1).toLowerCase() + f.substring(1), s, m, r;
		for(let i = 0; i < gl; ++i){
			s = g[i] + f, m = g[i] + b;
			r = typeof h.style[m] != u ? m : typeof h.style[s] != u ? s : null;
			if(r){
				h.remove();
				return r;
			}
		}
		return b;
	}

	/*
		вспомогательная ф-ция для метода fadeIn

		getFadeIn(element)
		@element - HTMLElement

		UPD 2.8
	*/
	function getFadeIn(a, t, v) {
		let b = getPrefix('opacity'), duration = t || 1000, start = w.performance.now();
		if (a.style[b] == '1') return false;
		if(getComputedStyle(a).display == 'none') a.style.display = v || 'block';

		w.requestAnimationFrame(function animate( now ){
			const progress = now - start;
			a.style[b] = progress / duration;
			if (progress < duration) {
				w.requestAnimationFrame(animate);
			}else{
				a.style[b] = 1;
			}
		});

		return true;
	}

	/*
		вспомогательная ф-ция для метода fadeOut

		getFadeOut(element)
		@element - HTMLElement

		UPD 2.8
	*/
	function getFadeOut(a, t) {
		let b = getPrefix('opacity'), duration = t || 1000, start = w.performance.now();
		if (getComputedStyle(a).display == 'none' || a.style[b] == '0') return false;

		w.requestAnimationFrame(function animate( now ){
			const progress = now - start;
			a.style[b] = (duration - progress) / 1000;
			if (progress < duration) {
				w.requestAnimationFrame(animate);
			}else{
				a.style.display = 'none';
				a.style[b] = 0;
			}
		});

		return true;
	}

	/*
		вспомогательная ф-ция для метода scrollTo

		scroll to element - scrolling.scrollTo(element, duration)
		@element - HTMLElement
		@duration - integer ms

		scroll to position - scrolling.animateScroll(position, duration)
		@position - integer px
		@duration - integer ms

		UPD 2.8
	*/
	let scrolling = {
		scrollTo: function (a, b, f) {
			f = 0;
			do {
				f += a.offsetTop;
				a = a.offsetParent;
			} while (a);
			f = f >= 0 ? f : 1;
			w.event.preventDefault();
			this.animateScroll(f, b);
			return false;
		},
		animateScroll: function (a, b, c, f, g, h, i, j) {
			c = c || d.documentElement || d.body, b = b || 1000, f = c.scrollTop, g = a - f, h = 0, i = 20;
			c.scrollTop = w.scrollY + 1;
			j = () => {
				h += i;
				c.scrollTop = Math.easeInOutQuad(h, f, g, b);
				if (h < b) setTimeout(j, i);
			};
			j();
		}
	};
	Math.easeInOutQuad = (t, b, c, d) => {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		--t;
		return -c / 2 * (t * (t - 2) - 1) + b;
	};

	/* основной класс $ */
	class App {

		/*
			Конструктор класса

			@a - string or HTMLCollection

			UPD 2.8
		*/
		constructor(selector, array) {

			array = typeof selector == 'string' && /<[a-z]+>/.test(selector) ? [d.createElement(selector.match(/[a-z]+/)[0])] : selector == w ? [w] : typeof selector == 'string' ? d.querySelectorAll(selector) : selector.length ? selector : [selector];

			this.selector = selector;
			this.length = array.length;

			for(let i = 0; i < this.length; ++i) this[i] = array[i];

			/*return this;*/
		}

		/*
			Добавляет класс элементам

			@a - string class name
		*/
		addClass(a) {
			for (let i = 0; i < this.length; ++i) this[i].classList.add(a);
			return this;
		}

		/*
			Вставляет HTMLElement или HTMLCollection в конец элемента(ов)

			@a - HTMLElement
			
			UPD 2.7
		*/
		after(a){
			for (let i = 0; i < this.length; ++i) this[i].appendChild(a);
			return this;
		}

		/*
			Вставляет произвольный текст или html-код в конец элемента(ов)

			@a - textContent
			
			UPD 2.7
		*/
		append(a) {
			for (let i = 0; i < this.length; ++i) this[i].innerHTML += a;
			return this;
		}

		/*
			Получает или устанавливает (если присутствует значение @b) атрибуты элементов
			Если элементов много (HTMLCollection) метод возвращает только атрибут первого элемента

			@a - property
			@b - value
		*/
		attr(a, b) {
			b = b || null;
			if (b) {
				for (let i = 0; i < this.length; ++i) this[i].setAttribute(a, b);
				return this;
			}
			return this.element[0].getAttribute(a);
		}

		/*
			Вставляет HTMLElement или HTMLCollection в начало элементов

			@a - HTMLElement

			UPD 2.7
		*/
		before(a){
			for (let i = 0; i < this.length; ++i) this[i].insertBefore(a,this[i].firstChild);
			return this;
		}

		/* 
			Убирает фокус с элемента
		*/
		blur() {
			for (let i = 0; i < this.length; ++i) this[i].blur();
			return this;
		}

		/*
			Меняет старый класс на новый у элементов

			@a - old className
			@b - new className
		*/
		changeClass(a, b) {
			for (let i = 0; i < this.length; ++i) {
				this[i].classList.remove(a);
				this[i].classList.add(b);
			}
			return this;
		}

		/* 
			Проверяет, отмечен ли чекбокс или радио-кнопка
			Проверка только первого элемента
		*/
		checked() {
			return this[0].checked;
		}

		/* 
			Собирает дочерние элементы

			@a - string selector
			если параметр @a указан, будут найдены элементы с указанным селектором
			
			UPD 2.8
		*/
		child(a, b, c) {
			b = [];
			for (let i = 0; i < this.length; ++i){
				c = a ? this[i].querySelectorAll(a) : this[i].children;
				for(let j = 0; j < c.length; ++j) b.push(c[j]);
			}
			for (let i = 0; i < this.length; ++i) this[i] = null;
			for (let i = 0; i < b.length; ++i) this[i] = b[i];
			return this;
		}

		/* 
			Очищает элементы INPUT и TEXTAREA
		*/
		clear(a) {
			for(let i = 0; i < this.length; ++i){
				a = this[i];
				if(a.tagName == 'INPUT'){
					if(['hidden', 'checkbox', 'file'].indexOf(a.type) == -1) a.value = '';
				}else if(a.tagName == 'TEXTAREA'){
					a.innerHTML = '';
				}else{
					continue;
				}
			}
			return this;
		}

		/*
			Устанавливает css свойства

			@a - object {property: value, ...}
			
			UPD 2.8
		*/
		css(a) {
			if(typeof a == 'object'){
				for (let b in a) for (let i = 0; i < this.length; ++i) this[i].style[getPrefix(b)] = a[b];
			} else if(typeof a == 'string') {
				return this[0].style[getPrefix(a)];
			} else {
				return null;
			}
			return this;
		}

		/* 
			Запуск и управление модальными окнами

			@a - object params
		*/
		coolModal(a, b){
			a = a || {};
			if(a == 'close'){
				for(let i = 0; i < this.length; ++i){
					if(this[i].style.display == 'block') new Modal('.' + this[i].classList[1]).init({action:'close'});
				}
				return this;
			}
			b = new Modal(this.selector);
			b.init(a);
			return b;
		}

		/*
			UPD 2.8

			Запуск и управление слайдером

			@a - object params
		*/
		coolSlider(a){
			if(typeof a != u){
				let b = new Slider(this.selector);
				b.init(a);
				return b;
			}else{
				return new Slider(this.selector);
			}
		}

		/*
			Получает значение data-атрибута

			@a - data-prop
			
			UPD 2.7
		*/
		data(a) {
			return this[0].getAttribute('data-' + a);
		}

		/*
			Задержка @t секунд перед выполнением функции @fn
		*/
		delay(t, fn){
			if(typeof fn != 'function') return false;
			setTimeout(fn, t * 1000);
		}

		/*
			Перебирает массив

			@a - object or element
			
			UPD 2.7
		*/
		each(a) {
			for (let i = 0; i < this.length; ++i) a.apply(this[i], arguments);
			return this;
		}

		/* 
			Очищает содержимое элементов
			
			UPD 2.7
		*/
		empty() {
			for (let i = 0; i < this.length; ++i) this[i].innerHTML = '';
			return this;
		}

		/* 
			Плавно показывает скрытые элементы
		*/
		fadeIn(a, b) {
			for (let i = 0; i < this.length; ++i) getFadeIn(this[i], a, b);
			return this;
		}

		/* 
			Плавно скрывает элементы
		*/
		fadeOut(a) {
			for (let i = 0; i < this.length; ++i) getFadeOut(this[i], a);
			return this;
		}

		/* 
			Перебирает HTMLInputElement типа file и возвращает массив найденных файлов
		*/
		files(a) {
			a = [];
			for (let i = 0; i < this.element.length; ++i) for (let j = 0; j < this.element[i].files.length; ++j) a.push(this.element[i].files[j]);
			return a;
		}

		/* 
			Ищет все дочерние элементы

			@a - string selector

			UPD 2.8
		*/
		find(a, b, c) {
			if(typeof a == u) return [];
			b = [];
			for (let i = 0; i < this.length; ++i){
				c = this[i].querySelectorAll(a);
				for(let j = 0; j < c.length; ++j) b.push(c[j]);
			}
			for (let i = 0; i < this.length; ++i) this[i] = null;
			for (let i = 0; i < b.length; ++i) this[i] = b[i];
			return this;
		}

		/* 
			Устанавливает фокус на первый элемент
		*/
		focus() {
			this[0].focus();
			return this;
		}

		/*
			Проверяет наличие класса у элементов
			Проверка только по первому элементу

			@a - string className
			@b - int index
		*/
		hasClass(a, b) {
			b = b || 0;
			return this[b].classList.contains(a);
		}

		/*
			Получает (только для первого элемента) или устанавливает высоту элементов

			@a - int value px

			для window и document высоту можно только получить
			
			UPD 2.7
		*/
		height(a) {
			a = a || null;
			if(this[0] == w || this[0] == d){
				return this[0].innerHeight;
			}else{
				if(a){
					for(let i = 0; i < this.length; ++i) this[i].style.height = a;
					return this;
				}else{
					return this[0].scrollHeight;
				}
			}
		}

		/* 
			Скрывает элементы
		*/
		hide() {
			for (let i = 0; i < this.length; ++i) this[i].style.display = 'none';
			return this;
		}

		/*
			Получает или устанавливает html-код элемента или произвольный текст

			@a - textContent or function
			
			UPD 2.7
		*/
		html(a) {
			if (typeof a != u) {
				for (let i = 0; i < this.length; ++i) this[i].innerHTML = typeof a == 'function' ? a() : a;
				return this;
			} else {
				return this[0].innerHTML;
			}
		}

		/*
			Вставляет HTMLElement в начало элемента

			@a - HTMLElement
			
			UPD 2.7
		*/
		insertBefore(a){
			for (let i = 0; i < this.length; ++i) this[i].parentNode.insertBefore(a, this[i].parentNode.firstChild);
			return this;
		}

		/*
			Вставляет HTMLElement в конец элемента

			@a - HTMLElement
			
			UPD 2.7
		*/
		insertAfter(a){
			for (let i = 0; i < this.length; ++i) this[i].parentNode.appendChild(a);
			return this;
		}

		/**/
		load(fn){
			for(let i = 0; i < this.length; ++i) this[0].addEventListener('load', fn);
			return true;
		}

		/*
			Собирает следующие элементы

			@a - string className
			если параметр @a указан будут найдены элементы с заданным селектором
		*/
		next(a, b, c) {
			b = [];
			for (let i = 0; i < this.length; ++i){
				if(a){
					c = this[i].parentNode.querySelectorAll(a);
					for(let j = 0; j < c.length; ++j) if(c[j] == this[i].nextElementSibling) b.push(this[i].nextElementSibling);
				}else{
					b.push(this[i].nextElementSibling);
				}
			}
			for (let i = 0; i < this.length; ++i) this[i] = null;
			for (let i = 0; i < b.length; ++i) this[i] = b[i];
			return this;
		}

		/*
			Отключает обработчик событий

			@a - event
			@b - callback function
			
			UPD 2.7
		*/
		off(a, b) {
			b = typeof b == 'function' ? b : () => {};
			let i = 0, t = w.setInterval(() => {
				if (i < this.length) {
					this[i].removeEventListener(a, b);
					++i;
				} else {
					w.clearInterval(t);
				}
			}, 20);
			return this;
		}

		/* 
			Получает координаты элемента
			Только первый элемент
		*/
		offset() {
			return this[0].getBoundingClientRect();
		}

		/*

			UPD 2.8

			Включает обработчик событий

			@a - event
			@b - если параметр @c является функцией - string selector, иначе function
			@c - function
			если параметр @c не является функцией или паремтр @b - функция, @c игнорируется

			$(selector).on('eventName', function(){}) - Для статических элементов
			$(document).on('eventName', 'selector', function(){}) - Для динамически созданных элементов
		*/
		on(a, b, c, f, g) {
			if(typeof c == 'function'){
				f = d.querySelectorAll(b);
				g = c;
			}else{
				f = this;
				g = b;
			}
			d.addEventListener(a, function(e){
				for (let i = 0; i < f.length; ++i) if (e.target == f[i] || e.target.parentNode == f[i]) return g.apply(f[i], arguments);
			});
		}

		/*
			Получает или изменяет внешний html код элементов

			@a - string textContent or function
			
			UPD 2.7
		*/
		outerHtml(a) {
			if (a) {
				for (let i = 0; i < this.length; ++i) this[i].outerHTML = typeof a == 'function' ? a() : a || '';
				return this;
			} else {
				return this[0].outerHTML;
			}
		}

		/*
			Получает родительские элементы

			@a - string className
			если параметр @a указан будут найдены элементы с заданным селектором
			
			UPD 2.7
		*/
		parent(a, b, c, f) {
			b = [];
			for (let i = 0; i < this.length; ++i){
				f = this[i].parentNode;
				if(a){
					c = f.parentNode.querySelectorAll(a);
					for(let j = 0; j < c.length; ++j) if(c[j] == f) b.push(f);
				}else{
					b.push(f);
				}
			}
			for (let i = 0; i < this.length; ++i) this[i] = null;
			for (let i = 0; i < b.length; ++i) this[i] = b[i];
			return this;
		}

		/*
			Вставляет textContent или html код в начало элементов

			@a - string textContent
		*/
		prepend(a) {
			for (let i = 0; i < this.length; ++i) this[i].innerHTML = a + this[i].innerHTML;
			return this;
		}

		/*
			Получает предыдущие элементы

			@a - string className
			если параметр @a указан будут найдены элементы с заданным селектором
			
			UPD 2.7
		*/
		prev(a) {
			let b = [];
			for (let i = 0; i < this.length; ++i){
				if(a){
					let c = this[i].parentNode.querySelectorAll(a);
					for(let j = 0; j < c.length; ++j) if(c[j] == this[i].previousElementSibling) b.push(this[i].previousElementSibling);
				}else{
					b.push(this[i].previousElementSibling);
				}
			}
			for (let i = 0; i < this.length; ++i) this[i] = null;
			for (let i = 0; i < b.length; ++i) this[i] = b[i];
			return this;
		}

		/*
			Выполняет функцию после загрузки DOM

			@fn - function
		*/
		ready(fn) {
			if (this[0] != d || !fn) return false;
			d.addEventListener('DOMContentLoaded', fn);
			return true;
		}

		/* 
			Удаляет элементы
		*/
		remove() {
			for (let i = 0; i < this.length; ++i) this[i].remove();
			return this;
		}

		/*
			Удаляет атрибуты элементов

			@a - string attribute name
		*/
		removeAttr(a) {
			for (let i = 0; i < this.length; ++i) this[i].removeAttribute(a);
			return this;
		}

		/*
			Удаляет класс @a у элемента
			@a - string className
		*/
		removeClass(a) {
			for (let i = 0; i < this.length; ++i) this[i].classList.remove(a);
			return this;
		}

		/*
			Событие скролла
			@fn - callback функция
		*/
		scroll(fn, self){
			self = this;
			w.addEventListener('scroll', function(e){
				for (let i = 0; i < self.length; ++i) if (e.target == w || e.target == d || e.target == self[i] || e.target.parentNode == self[i]) return fn.apply(self[i], arguments);
			});
		}

		/*
			Скролл к заданной позиции или к элементу

			@a - int position or string selector
			@b - int duration ms
			@fn - callback функция
		*/
		scrollTo(a, b, fn) {
			typeof a == 'number' ? scrolling.animateScroll(a, b) : scrolling.scrollTo(d.querySelector(a), b);
			if(typeof fn == 'function') fn();
			return this;
		}

		/* 
			Подготавливает данные для отправки через URL возвращая объект {key:value}
			
			UPD 2.7
		*/
		serialized(a, b) {
			a = this[0].querySelectorAll('input,select,textarea'), b = {};
			for (let i = 0; i < a.length; ++i) {
				if (a[i].type == 'file') {
					for (let j = 0; j < a[i].files.length; ++j) b[a[i].getAttribute('name') + j] = a[i].files[j];
				} else {
					b[a[i].getAttribute('name')] = a[i].value;
				}
			}
			return b;
		}

		/* 
			

			@a - значение свойства display, по умолчанию block
		*/
		slideDown(a) {
			
		}

		/* 
			

			@a - значение свойства display, по умолчанию block
		*/
		slideToggle(a) {
			
		}

		/* 
			

			
		*/
		slideUp() {
			
		}

		/* 
			Показывает скрытый элемент

			@a - значение свойства display, по умолчанию block
		*/
		show(a) {
			for (let i = 0; i < this.length; ++i) this[i].style.display = a || 'block';
			return this;
		}

		/* 
			Возвращает текущую прокрутку окна в px
		*/
		top() {
			return this[0].scrollY || null;
		}

		/*
			@a - string className
		*/
		toggleClass(a) {
			for (let i = 0; i < this.length; ++i) this[i].classList.toggle(a);
			return this;
		}

		/*
			Вызывает событие

			@a - event
			@b - callback function
			
			UPD 2.7
		*/
		trigger(a, b) {
			if (typeof a == u) return;
			if (this[0] == w || this[0] == d) {
				this[0].dispatchEvent(new Event(a));
			} else {
				for (let i = 0; i < this.length; ++i) this[i].dispatchEvent(new Event(a));
			}
			if(typeof b == 'function') b();
			return this;
		}

		/*
			Получает или устанавливает значение в HTMLInputElement

			@a - value
		*/
		val(a) {
			a = a || a === '' ? a : null;
			if (a) {
				for (let i = 0; i < this.length; ++i) this[i].value = a;
				return true;
			} else {
				return this[0].value;
			}
		}

		/* 
			Производит валидацию полей
			возвращает объект вида {error:'error status (bool) or text', valid: 'valid status (bool)'}
			
			@fn - callback
			
			UPD 2.7
		*/
		validated(fn) {
			let b = this[0].querySelectorAll('input,select,textarea'),
				c = 0,
				incorrect = 'Некорректный номер телефона<br>пример: +79123456789, 89123456789, 88001234567 или 642531';
			for (let key in b) {
				if (isFinite(key)) {
					let k = b[key],
						valid = k.validity,
						error = k.getAttribute('error') || null;
					if (k.required) {
						if (k.tagName === 'INPUT') {
							if (k.type === 'number') {
								if (k.min && valid.rangeUnderflow) {
									error = error || 'Минимальное значение поля ' + k.min;
									++c;
								}
								if (k.max && valid.rangeOverflow) {
									error = error || 'Максимальное значение поля ' + k.max;
									++c;
								}
							} else if (k.type === 'tel') {
								let kv=k.value,kvl=kv.length;
								if(kvl < 5){
									error = error || incorrect;
									++c;
								}else if (kvl > 7 && (kvl < 11 || kvl > 12)){
									error = error || incorrect;
									++c;
								}else if(kvl === 11){
									if(!/^8[8|9]{1}[\d]{2}[\d]{7}$/.test(kv)){
										error = error || incorrect;
										++c;
									}
								}else if(kvl === 12){
									if(!/^\+79[\d]{2}[\d]{7}$/.test(kv)){
										error = error || incorrect;
										++c;
									}
								}else if(kvl > 4 && kvl < 8){
									if(!/^[\d]{5,7}$/.test(kv)){
										error = error || incorrect;
										++c;
									}
								}
							} else if (k.type === 'email') {
								if (valid.typeDismatch) {
									error = error || 'Некорректный ввод email<br>пример: name@mailserver.ru';
									++c;
								}
							}
							if (k.pattern && valid.patternMismatch) {
								error = error || 'Проверьте правильность заполнения полей';
								++c;
							}
							if (valid.typeDismatch) {
								error = error || 'Некорректное значение "' + k.value + '"';
								++c;
							}
						}
						if (valid.valueMissing) {
							error = error || 'Обязательные поля не заполнены';
							++c;
						}
						if (c > 0) {
							if(typeof fn == 'function') fn();
							return {error:error,valid:false};
						}
					}
				}
			}
			return {error:false,valid:true};
		}
	}

	/* Инициализация глобальных переменных */
	if(typeof w.$ != u){
		w.jCool = (a) => new App(a);
	}else{
		w.$ = (a) => new App(a);
	}

	/* вспомогательный класс */
	class Set {

		/*
			Выполняет Ajax запрос

			@a - object settings
			@b and @c - empty, ignored
			
			UPD 2.7
		*/
		ajax(a) {
			let c = new XMLHttpRequest(), b = {
				type: 'POST',
				url: null,
				success: null,
				json: true,
				error: null,
				files: null,
				before: null,
				callback: null,
				asinc: true,
				data: null
			};
			for (let f in b) if(typeof a[f] != u) b[f] = a[f];
			a = null;
			if(typeof b.before == 'function') b.before();
			c.open(b.type, b.url, b.asinc);
			c.onreadystatechange = function () {
				try {
					if (this.readyState !== 4 || this.status !== 200) return;
					if (b.success)
						if (b.json) {
							b.success(JSON.parse(this.responseText));
						} else {
							b.success(this.responseText);
						}
				} catch (e) {
					if (b.error) b.error(e);
				}
			};
			if (b.files) {
				c.send(this.formFiles(b.data));
			} else {
				c.send(this.form(b.data));
			}
			return typeof b.callback == 'function' ? b.callback() : this;
		}

		
		/*
			Устанавливает фоновое изображение в элементе @a

			@a - string selector or HTMLElement or HTMLElementCollection
			@b - file
		*/
		bgImage(a, b) {
			if (b.type.match(/image.*/)) {
				let reader = new FileReader();
				reader.onload = function (e) {
					new App(a).css({'background-image': 'url(' + e.target.result + ')'});
				};
				reader.readAsDataURL(b);
			}
		}

		/*
			Копирует данные в буфер обмена. Внимание, копирование не будет произведено если для body указано свойство user-select: none

			@a - string copy data
		*/
		copy(a) {
			if (typeof a == u) return false;
			let b, c = d.createElement('input');
			c.value = a;
			d.body.append(c);
			c.select();
			if (d.execCommand('copy')) {
				b = true;
			} else {
				b = false;
			}
			w.getSelection().removeAllRanges();
			c.remove();
			localStorage.setItem('clip', a);
			return b;
		}

		/*
			Инициализирует счетчик чисел от 0 до заданного

			@a - HTMLElement
			
			UPD 2.7
		*/
		countPlus(a) {
			let f = a.dataset,
				g = {
					count: 100,
					duration: 1000,
					delay: 100,
					start: 0
				};
			for (let h in g) if(typeof f[h] != u) g[h] = f[h];
			f = null;
			let step = parseFloat(g.count / 100);
			setTimeout(function () {
				let interval = setInterval(function () {
					if (g.start + step >= parseFloat(g.count)) {
						a.innerHTML = g.count;
						clearInterval(interval);
					}
					g.start += step;
					a.innerHTML = parseInt(g.start);
				}, g.duration / 100);
			}, g.delay);
		}

		/*
			Удаляет запись localStorage @a

			@a - key
		*/
		delStorage(a){
			if(this.getStorage(a)) localStorage.removeItem(a);
			return this;
		}

		/*
			Производит поиск значения @b по строке @a

			@a - string
			@b - key
		*/
		find(a, b, c, f) {
			a = a || null, b = b || null;
			if(!a || !b) return null;
			try {
				c = new RegExp(b);
				f = a.match(c);
			}
			catch(e) {
				f = a.match(b);
			}
			return f;
		}

		/*
			Собирает данные в объект FormData

			@a - object data
			@b - FormData
		*/
		form(a, b) {
			b = b || new FormData();
			for (let key in a) if (a.hasOwnProperty(key)) b.append(key, a[key]);
			return b;
		}

		/*
			Собирает файлы в объект FormData

			@a - array files
			@b - FormData
			
			UPD 2.7
		*/
		formFiles(a, b) {
			b = b || new FormData();
			for (let i = 0; i < a.length; ++i) b.append(i, a[i]);
			return b;
		}

		/*
			Получает значение localStorage @a, если записи не найдено возвращает null 

			@a - требуемый ключ
		*/
		getStorage(a){
			return localStorage.getItem(a) || null;
		}

		/*
			Создает изображение и добавляет его в конец элемента @a

			@a - string selector or HTMLElement
			@b - file
		*/
		image(a, b) {
			if (b.type.match(/image.*/)) {
				let reader = new FileReader();
				reader.onload = function (e) {
					let img = new Image();
					img.src = e.target.result;
					a.append(img);
				};
				reader.readAsDataURL(b);
			}
		}

		/*
			Создает превью из файлов элемента @a, добавляет их в элемент @c и выводит информацию о файлах в элемент @b

			@a - HTMLInputElement type file
			@b - selector text element
			@c - selector preview element
		*/
		imgPreview(a, b, c) {
			let f = a.files, g = d.querySelector(b), h = d.querySelector(c);
			function reader_load(e){
				e = e || w.event;
				let img = new Image();
				img.src = e.target.result;
				h.appendChild(img);
			}
			if (f.length) {
				h.innerHTML = '';
				let reader = new FileReader();
				for(let i = 0; i < f.length; ++i){
					if(f[i].type.match(/image.*/)){
						reader.onload = reader_load();
						reader.readAsDataURL(f[i]);
					}
				}
				g.innerHTML = f.length == 1 ? f[0].name + ' (' + (f[0].size / 1024).toFixed(2) + ' Кб)' : 'Добавлено ' + f.length + ' файлов';
			} else {
				g.innerHTML = 'Выберите файл';
				h.innerHTML = 'Предпросмотр';
			}
			return this;
		}

		/*
			Разбирает строку JSON

			@a - json object
		*/
		json(a) {
			return JSON.parse(a);
		}

		/*
			Превращает объекты в строку в формате JSON

			@a - json object
		*/
		string(a) {
			return JSON.stringify(a);
		}

		/* 
			Вывод данных в консоль для отладки
		*/
		log() {
			for (let i = 0; i < arguments.length; ++i) console.info(arguments[i]);
			return this;
		}

		/*
			Устанавливает запись localStorage @a = b
			Допустимые операции:
				fn.setStorage(a, b)
				fn.setStorage({a: b, c: d})

			@a - key or object {key: value}
			@b - value, if @a == string
		*/
		setStorage(a, b){
			if(typeof a == 'object'){
				for(let i in a) localStorage.setItem(i, a[i]);
			}else{
				localStorage.setItem(a, b);
			}
			return this;
		}

		/*
			Имитирует сон скрипта

			@a - int sleep time ms
			@fn - callback function
		*/
		sleep(a, fn) {
			setTimeout(fn || function(){}, a);
			return this;
		}

		/*
			Транслитерация введенных данных (ru => en)

			@a - string data
			@b - ignored
		*/
		translite(a, b) {
			let c = typeof b != u ? {} : {'а': 'a','б': 'b','в': 'v','г': 'g','д': 'd','е': 'e','ж': 'g','з': 'z','и': 'i','й': 'y','к': 'k','л': 'l','м': 'm','н': 'n','о': 'o','п': 'p','р': 'r','с': 's','т': 't','у': 'u','ф': 'f','ы': 'y','э': 'e','А': 'A','Б': 'B','В': 'V','Г': 'G','Д': 'D','Е': 'E','Ж': 'G','З': 'Z','И': 'I','Й': 'Y','К': 'K','Л': 'L','М': 'M','Н': 'N','О': 'O','П': 'P','Р': 'R','С': 'S','Т': 'T','У': 'U','Ф': 'F','Ы': 'Y','Э': 'E','ё': 'yo','х': 'h','ц': 'ts','ч': 'ch','ш': 'sh','щ': 'shch','ъ': '','ь': '','ю': 'yu','я': 'ya','Ё': 'YO','Х': 'H','Ц': 'TS','Ч': 'CH','Ш': 'SH','Щ': 'SHCH','Ъ': '','Ь': '','Ю': 'YU','Я': 'YA',' ': '_','.': '_',',': '_','?': '_','!': '_','-': '_','=': '_','+': '_','__': '_'};
			return a.replace(/[\s\S]/g, (x) => {
				if (c.hasOwnProperty(x)) return c[x];
				return x;
			});
		}

		/*
			Открывает дополнительные вкладки или окна браузера с заданным URL

			@a - object settings
			
			UPD 2.7
		*/
		window(a) {
			let b = {
				width: w.screen.width,
				height: w.screen.height,
				url: null,
				x: w.screen.width / 2,
				y: w.screen.height / 2,
				before: null,
				callback: null,
				full: 0,
				tool: 0,
				status: 0,
				menu: 0,
				resize: 0,
				focus: true
			};
			for (let c in b) if(typeof a[c] != u) b[c] = a[c];
			if(typeof b.before == 'function') b.before();
			let e = w.open('/', 'White..', 'fullscreen=' + b.full + ',toolbar=' + b.tool + ',status=' + b.status + ',menubar=' + b.menu + ',resizable=' + b.resize + ',width=' + b.width + ',height=' + b.height);
			e.blur();
			if (b.url) e.location.href = b.url;
			e.moveTo(b.x, b.y);
			if (b.focus) e.focus();
			if (typeof b.callback == 'function') b.callback();
			return e;
		}
	}

	/* Класс для работы с модальными окнами */
	class Modal {

		/*
			Инициализация класса

			@a - string selector or object HTMLCollection
		*/
		constructor(a) {
			this.string = a || null;
			this.box = d.querySelector(this.string) || this.string || null;
		}

		/*
			Инициализация модального окна

			@a - object settings
			
			ADD 2.8
		*/
		init(a, b) {
			if (!this.box) return;
			a = a || {}, b = {
					action: 'open',
					over: '.modal_overlay',
					old: null,
					new: null,
					time: null,
					before: () => {},
					callback: () => {}
				};
			for (let c in b) this[c] = typeof a[c] != u ? a[c] : b[c];
			a = null;
			if(this.action == 'open'){
				this.open();
			} else if(this.action == 'close') {
				this.close();
			} else if(this.action == 'change') {
				this.change();
			}
			return this;
		}
		open () {
			if (!this.box) return;
			this.before();
			if (this.over) getFadeIn(d.querySelector(this.over), 500);
			getFadeIn(this.box, 1000);
			this.time ? setTimeout(() => this.close(this.callback), this.time * 1000) : this.callback();
			return this;
		}
		close (a) {
			if (!this.box) return;
			if (this.over) getFadeOut(d.querySelector(this.over), 1000);
			getFadeOut(this.box, 500);
			if(typeof a == 'function') a();
			return this;
		}
		change () {
			if (!this.box || !this.new) return;
			getFadeOut(this.box);
			getFadeIn(d.querySelector(this.new));
			this.box = this.new;
		}
	}

	/* класс слайдера */
	class Slider {

		/*
			Инициализация класса

			@a - string selector or object HTMLCollection
		*/
		constructor(a) {
			this.string = a;
			this.box = d.querySelector(a) || null;
		}

		/*
			Инициализация слайдера

			@a - object settings
			
			UPD 2.7
		*/
		init(a) {
			if (!this.box) return;
			a = a || {};
			let b = {
					autoplay: true,
					before: false,
					callback: false,
					currentSlide: 0,
					delay: 3000,
					dots: true,
					dots_box: null,
					dots_list: [],
					interval: null,
					method: 'fade'
				};
			for (let c in b) this[c] = typeof a[c] != u ? a[c] : b[c];
			this.slides = this.box.querySelectorAll('.slide');
			this.length = this.slides.length;
			if (!this.length) return;
			if (this.dots === true) {
				if(this.dots_box === null){
					let br = d.createElement('ul');
					br.className = 'slider_dots';
					for (let i = 0; i < this.length; ++i) {
						let dot = d.createElement('li');
						dot.setAttribute('data-slide', i);
						dot.className = 'slider_dot';
						br.appendChild(dot);
						this.dots_list.push(dot);
					}
					d.querySelector(this.string).appendChild(br);
				}else{
					this.dots_list = d.querySelectorAll(this.dots_box + ' .slider_dot');
				}
			}
			/* переписать в метод go */
			/*let styles = '';
			if(this.method == 'fade'){
				styles = this.string + ' .slide{transition:opacity .3s;opacity:0}' + this.string + ' .slide_active{opacity:1}';
			}*/
			this.slides[this.currentSlide].classList.add('slide_active');
			if (this.dots) this.dots_list[this.currentSlide].classList.add('dot_active');
			if (this.autoplay === true) this.start();
			return this;
		}

		/* 
			Старт автоматического пролистывания
		*/
		start() {
			if (!this.box || !this.length) return;
			this.interval = w.setInterval(() => this.next(), this.delay);
		}

		/* 
			Остановка автоматического пролистывания
		*/
		stop() {
			w.clearInterval(this.interval);
			this.interval = null;
		}

		/* 
			Переход к предыдущему слайду
		*/
		prev() {
			if (!this.box || !this.length) return;
			this.stop();
			this.go(this.currentSlide - 1);
			this.start();
		}

		/* 
			Переход к следующему слайду
		*/
		next() {
			if (!this.box || !this.length) return;
			this.stop();
			this.go(this.currentSlide + 1);
			this.start();
		}

		/*
			Переход к заданному слайду

			@n - int need slide
		*/
		go(n) {
			if (!this.box || !this.length) return;
			if (typeof this.before == 'function') this.before();
			this.slides[this.currentSlide].classList.remove('slide_active');
			if (this.dots) this.dots_list[this.currentSlide].classList.remove('dot_active');
			this.currentSlide = parseInt((n + this.length) % this.length);
			this.slides[this.currentSlide].classList.add('slide_active');
			if (this.dots) this.dots_list[this.currentSlide].classList.add('dot_active');
			return typeof this.callback == 'function' ? this.callback() : this;
		}
	}

	w.fn = new Set();
})(window, document, 'undefined');
