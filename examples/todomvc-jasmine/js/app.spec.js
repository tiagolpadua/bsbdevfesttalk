describe('TODO MVC App', function () {

    describe('App tests', function () {
        var emptyTODOList;
        var oneCompletedTODOList;
        var twoCompletedTODOList;

        beforeEach(function () {
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
        });

        describe('getActiveTodos', function () {
            it('Deve retornar zero TODOs ativos quando a lista de TODOs estiver vazia', function () {
                App.todos = emptyTODOList;
                expect(App.getActiveTodos().length).toBe(0);
            });

            it('Deve retornar um TODO ativos quando a lista de TODOs tiver um TODO completo', function () {
                App.todos = oneCompletedTODOList;
                expect(App.getActiveTodos().length).toBe(1);
            });

            it('Deve retornar zero TODOs ativos quando a lista de TODOs tiver dois TODOs completos', function () {
                App.todos = twoCompletedTODOList;
                expect(App.getActiveTodos().length).toBe(0);
            });
        });

        describe('getCompletedTodos', function () {
            it('Deve retornar zero TODOs completos quando a lista de TODOs estiver vazia', function () {
                App.todos = emptyTODOList;
                expect(App.getCompletedTodos().length).toBe(0);
            });

            it('Deve retornar um TODO completo quando a lista de TODOs tiver um TODO completo', function () {
                App.todos = oneCompletedTODOList;
                expect(App.getCompletedTodos().length).toBe(1);
            });

            it('Deve retornar dois TODOs completos quando a lista de TODOs tiver dois TODOs completos', function () {
                App.todos = twoCompletedTODOList;
                expect(App.getCompletedTodos().length).toBe(2);
            });
        });

        describe('getFilteredTodos', function () {
            it('Deve retornar zero TODOs filtrados quando a lista de TODOs estiver vazia', function () {
                App.filter = null;
                App.todos = emptyTODOList;
                expect(App.getFilteredTodos().length).toBe(0);
            });

            it('Deve retornar dois TODOs filtrados quando a lista de TODOs tiver dois TODOs e o filtro for vazio', function () {
                App.filter = null;
                App.todos = oneCompletedTODOList;
                expect(App.getFilteredTodos().length).toBe(2);
            });

            it('Deve retornar um TODO filtrado quando a lista de TODOs tiver um TODOs incompleto e o filtro for \'active\'', function () {
                App.todos = oneCompletedTODOList;
                App.filter = 'active';
                expect(App.getFilteredTodos().length).toBe(1);
            });

            it('Deve retornar dois TODOs filtrados quando a lista de TODOs tiver dois TODOs completos e o filtro for \'completed\'', function () {
                App.todos = twoCompletedTODOList;
                App.filter = 'completed';
                expect(App.getFilteredTodos().length).toBe(2);
            });
        });

        // it('Deve retornar um um valor previamente armazenado', function () {
        //     App.init();
        //     expect(App.render()).toBe(true);
        // });
    });

    describe('util tests', function () {
        describe('uuid', function () {
            it('Deve retornar um uuid', function () {
                expect(util.uuid()).toBeDefined();
            });
        });

        describe('pluralize', function () {
            it('Deve retornar \'word\' ao plurarizar com count 1 a palavra \'word\'', function () {
                expect(util.pluralize(1, 'word')).toBe('word');
            });

            it('Deve retornar \'words\' ao plurarizar com count 1 a palavra \'word\'', function () {
                expect(util.pluralize(2, 'word')).toBe('words');
            });
        });

        describe('store', function () {
            it('Deve retornar um array vazio ao recuperar um dado não armazenado', function () {
                expect(util.store('foo')).toEqual([]);
            });

            it('Deve retornar um um valor previamente armazenado', function () {
                util.store('foobar', 'barfoo')
                expect(util.store('foobar')).toBe('barfoo');
            });
        });

    });

});