module.exports = {
    EMAIL_REGEX: (value) => {
        const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return validEmail.test(value)
    },
    
    PASSWORD_REGEX: (value) => {
        const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!#@$?/%µ²*,&~èçà+_¤-])[a-zA-Z0-9!#@$?/%µ²*,&~èçà+_¤-]{8,}$/
        return validPassword.test(value)
    },

    PSEUDO_REGEX: (value) => {
        const validPseudo = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,15}$/
        return validPseudo.test(value)
    }
}

