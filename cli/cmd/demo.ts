interface Demo {
    a: Number,
    a1?: String,
    f: () => String
}

function Demo1(): Demo{
    return {
        a: 1,
        f: function(): String{
            return 'as';
        }
    }
}