# gallop
still working...

        yarn add @gallop/gallop 


//Feature

        use template literals to auto detect dynamic & static code
        
        register web component in functional way 

        component('name-name',
        ({props})=>html`
                let [state] = useState({initState})

                <div>${state}</div>
        `.useContext([someContext]))

        common feature in react

        : to bind props of component
        . to bind attributes 
        @ to bind events, support @click.once.capture.passive like vue

        auto minimize update

        built-in state management solution

        naturally support async component by import()

        for more detail, check packages/test-example

//TODO  

        hooks                           useState()               ✔
                                        useContext()             ✔
                                        useEffect()              ✔
                                        useRef()
                                        useMemo()
        
        context                                                  ✔

        async update queue                                       ✔      

        dynamic scoped css by shadowdom
        
        scoped scss inject

