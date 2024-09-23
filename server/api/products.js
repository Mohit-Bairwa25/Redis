export const getProducts = ()=>
    new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve({
                products:[
                    {
                        id: 1,
                        name:"Product 1",
                        price:1000,
                    },
                ],
            });
        },2000);
    });

    export const getProductDetail = (id)=>
        new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve({
                    product:[
                        {
                            id: id,
                            name:"Product ${id}",
                            price:Math.floor(Math.random() * id * 100),
                        },
                    ],
                });
            },2000);
        });