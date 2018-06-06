const App = require('../js/app').App;
const util = require('../js/app').util;
const html = require('fs').readFileSync('./index.html').toString();

describe('TODO MVC App', () => {
    describe('App tests', () => {
        let emptyTODOList;
        let oneCompletedTODOList;
        let twoCompletedTODOList;

        const mockLocalStorage = () => {
            const store = {};
            spyOn(localStorage, 'getItem').and.callFake(key => store[key]);
            spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value + '');
            spyOn(localStorage, 'clear').and.callFake(() => store = {});
        }

        const resetLists = () => {
            emptyTODOList = [];

            oneCompletedTODOList = [{
                id: 1,
                title: 'Um título',
                completed: true
            },
            {
                id: 2,
                title: 'Outro título',
                completed: false
            }];

            twoCompletedTODOList = [{
                id: 1,
                title: 'Um título',
                completed: true
            },
            {
                id: 2,
                title: 'Outro título',
                completed: true
            }];
        }

        const initApp = () => {
            mockLocalStorage();
            document.documentElement.innerHTML = html;
            App.init();
            util.store('todos-jquery', []);
        };

        describe('Handlebars Helpers Customizados', () => {
            describe('A marcação helper "eq"', () => {
                let options;
                let helpers;

                beforeEach(() => {
                    resetLists();

                    options = {
                        fn: () => { },
                        inverse: () => { }
                    };

                    spyOn(options, 'fn');
                    spyOn(options, 'inverse');

                    helpers = Handlebars.helpers;
                });

                it('deve estar registrada', () => {
                    expect(helpers.eq).toBeDefined();
                });
                it('deve acionar a função fn do objeto options quando os parâmetros forem iguais', () => {
                    helpers.eq('a', 'a', options);
                    expect(options.fn).toHaveBeenCalled();
                });

                it('deve acionar a função inverse do objeto options quando os parâmetros forem diferentes', () => {
                    helpers.eq('a', 'b', options);
                    expect(options.inverse).toHaveBeenCalled();
                });
            });
        });

        describe('toggleAll', () => {
            beforeEach(() => {
                initApp();
                resetLists();
            });

            it('Deve ativar todos os TODOS se o target estiver desativado', () => {
                App.todos = oneCompletedTODOList;
                $('.toggle-all').prop('checked', true);
                $('.toggle-all').trigger('change');
                expect(App.todos.filter(t => t.completed).length).toBe(2);
            });

            it('Deve desativar todos os TODOS se o target estiver ativado', () => {
                App.todos = oneCompletedTODOList;
                $('.toggle-all').prop('checked', false);
                $('.toggle-all').trigger('change');
                expect(App.todos.filter(t => t.completed).length).toBe(0);
            });
        });

        describe('getActiveTodos', () => {
            beforeEach(() => resetLists());

            it('Deve retornar zero TODOs ativos quando a lista de TODOs estiver vazia', () => {
                App.todos = emptyTODOList;
                expect(App.getActiveTodos().length).toBe(0);
            });

            it('Deve retornar um TODO ativos quando a lista de TODOs tiver um TODO completo', () => {
                App.todos = oneCompletedTODOList;
                expect(App.getActiveTodos().length).toBe(1);
            });

            it('Deve retornar zero TODOs ativos quando a lista de TODOs tiver dois TODOs completos', () => {
                App.todos = twoCompletedTODOList;
                expect(App.getActiveTodos().length).toBe(0);
            });
        });

        describe('getCompletedTodos', () => {
            beforeEach(() => resetLists());

            it('Deve retornar zero TODOs completos quando a lista de TODOs estiver vazia', () => {
                App.todos = emptyTODOList;
                expect(App.getCompletedTodos().length).toBe(0);
            });

            it('Deve retornar um TODO completo quando a lista de TODOs tiver um TODO completo', () => {
                App.todos = oneCompletedTODOList;
                expect(App.getCompletedTodos().length).toBe(1);
            });

            it('Deve retornar dois TODOs completos quando a lista de TODOs tiver dois TODOs completos', () => {
                App.todos = twoCompletedTODOList;
                expect(App.getCompletedTodos().length).toBe(2);
            });
        });

        describe('getFilteredTodos', () => {
            beforeEach(() => resetLists());

            it('Deve retornar zero TODOs filtrados quando a lista de TODOs estiver vazia', () => {
                App.filter = null;
                App.todos = emptyTODOList;
                expect(App.getFilteredTodos().length).toBe(0);
            });

            it('Deve retornar dois TODOs filtrados quando a lista de TODOs tiver dois TODOs e o filtro for vazio', () => {
                App.filter = null;
                App.todos = oneCompletedTODOList;
                expect(App.getFilteredTodos().length).toBe(2);
            });

            it('Deve retornar um TODO filtrado quando a lista de TODOs tiver um TODOs incompleto e o filtro for \'active\'', () => {
                App.todos = oneCompletedTODOList;
                App.filter = 'active';
                expect(App.getFilteredTodos().length).toBe(1);
            });

            it('Deve retornar dois TODOs filtrados quando a lista de TODOs tiver dois TODOs completos e o filtro for \'completed\'', () => {
                App.todos = twoCompletedTODOList;
                App.filter = 'completed';
                expect(App.getFilteredTodos().length).toBe(2);
            });
        });

        describe('destroyCompleted', () => {
            beforeEach(() => {
                initApp();
                resetLists();
            });

            it('Deve remover TODOs completos da lista', () => {
                App.todos = oneCompletedTODOList;
                // $('.footer').trigger('click');
                App.destroyCompleted();
                expect(App.todos.length).toBe(1);
            });
        });

        describe('create', () => {
            beforeEach(() => {
                initApp();
                resetLists();
            });

            it('Deve criar um TODO com base no texto digitado e pressionada tecla ENTER', () => {
                App.todos = emptyTODOList;
                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
                expect(App.todos.length).toBe(1);
            });

            it('Não deve criar um TODO se a tecla pressionada não for ENTER', () => {
                App.todos = emptyTODOList;
                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 0 });
                $('.new-todo').trigger(e);
                expect(App.todos.length).toBe(0);
            });
        });

        describe('toggle', () => {
            beforeEach(() => {
                initApp();

                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
            });

            it('Deve completar um TODO incompleto quando clicar no toggle', () => {
                let checkbox = $('.toggle')[0];
                $(checkbox).trigger('click');
                expect(App.todos[0].completed).toBeTruthy();
            });

            it('Deve incompletar um TODO completo quando clicar no toggle', () => {
                let checkbox = $('.toggle')[0];
                $(checkbox).trigger('click');

                checkbox = $('.toggle')[0];
                $(checkbox).trigger('click');
                expect(App.todos[0].completed).toBeFalsy();
            });
        });

        describe('editingMode', () => {
            beforeEach(() => {
                initApp();

                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
            });

            it('Deve colocar um TODO em edição quando receber um double click', () => {
                let label = $('div.view>label')[0];
                $(label).dblclick()
                expect($('.editing').length).toBe(1);
            });
        });

        describe('update', () => {
            beforeEach(() => {
                initApp();

                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
            });

            it('Deve atualizar o conteúdo do TODO em edição quando o foco for perdido', () => {
                const label = $('div.view>label')[0];
                $(label).dblclick();
                $(':focus').val('bar foo');
                $(':focus').blur();
                expect(App.todos[0].title).toBe('bar foo');
            });
        });

        describe('editKeyup', () => {
            beforeEach(() => {
                initApp();

                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
            });

            it('Teclar ENTER durante a edição, atualiza o valor do TODO e encerra a edição', () => {
                const label = $('div.view>label')[0];
                $(label).dblclick();
                $(':focus').val('bar foo');
                const e = $.Event('keyup', { which: 13 });
                $(':focus').trigger(e);
                expect(App.todos[0].title).toBe('bar foo');
                expect($('.editing').length).toBe(0);
            });

            it('Teclar ESC durante a edição, cancela a edição', () => {
                const label = $('div.view>label')[0];
                $(label).dblclick();
                $(':focus').val('bar foo');
                const e = $.Event('keyup', { which: 27 });
                $(':focus').trigger(e);
                expect(App.todos[0].title).toBe('foo bar');
                expect($('.editing').length).toBe(0);
            });
        });

        describe('destroy', () => {
            beforeEach(() => {
                initApp();

                $('.new-todo').val('foo bar');
                const e = $.Event('keyup', { which: 13 });
                $('.new-todo').trigger(e);
            });

            it('Deve remover o TODO', () => {
                $('.destroy')[0].click();
                expect(App.todos.length).toBe(0);
            });
        });
    });

    describe('util tests', () => {

        const mockLocalStorage = () => {
            const store = {};
            spyOn(localStorage, 'getItem').and.callFake(key => store[key]);
            spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value + '');
            spyOn(localStorage, 'clear').and.callFake(() => store = {});
        }

        beforeEach(() => mockLocalStorage());

        describe('uuid', () => {
            it('Deve retornar um uuid', () => {
                expect(util.uuid()).toBeDefined();
            });
        });

        describe('pluralize', () => {
            it('Deve retornar \'word\' ao plurarizar com count 1 a palavra \'word\'', () => {
                expect(util.pluralize(1, 'word')).toBe('word');
            });

            it('Deve retornar \'words\' ao plurarizar com count 1 a palavra \'word\'', () => {
                expect(util.pluralize(2, 'word')).toBe('words');
            });
        });

        describe('store', () => {
            it('Deve retornar um array vazio ao recuperar um dado não armazenado', () => {
                expect(util.store('foo')).toEqual([]);
            });

            it('Deve retornar um um valor previamente armazenado', () => {
                util.store('foobar', 'barfoo')
                expect(util.store('foobar')).toBe('barfoo');
            });
        });

    });
});