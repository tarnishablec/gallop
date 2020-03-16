# jumoku
still working...

        yarn add @jumoku/jumoku 


//Feature

        use template literals to auto detect dynamic & static code
        
        register web component in functional way 

        component('name-name',
        ({props})=>html`
                <div>${props}</div>
        `.useContext([someContext]))

        common feature in react

        : to bind props of component
        . to bind attributes 
        @ to bind events, support @click.once.capture.passive like vue

        auto minimize update

        for more detail, check packages/test-example

//TODO  

        hooks                           useState()
                                        useEffect() 
                                        useContext()             ✔
        
        context                                                  ✔

        async update queue                                       ✔      

        scoped css by shadowdom
        
        scoped scss inject

