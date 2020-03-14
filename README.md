# jumoku
still working...

        yarn add @jumoku/jumoku 


//Feature

        use template literals to auto detect dynamic & static code
        
        register web component in functional way 
                component('name-name',({props})=>html`
                    <div>${props}</div>
                `)

        common feature in react

        : to bind props of component
        . to bind attributes 
        @ to bind events, support @click.once.capture.passive like vue

        useKey() to enable list diff by keys

        auto minimize update

        for more detail, check package/test-example

//TODO  

        hooks                           useState()
                                        useEffect() 
                                        useContext()             ✔
        
        context                                                  ✔

        async update queue                                       ✔      

        scoped css by shadowdom
        
        scoped scss inject

