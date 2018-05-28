describe('TODO MVC App', function () {

    var emptyTODOList;

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

});