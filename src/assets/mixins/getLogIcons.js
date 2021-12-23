export const getLogIcons = {
    methods: {
        getLogIcons(input){
            if (
                input == "IER" ||
                input == "IEM" || 
                input == "IPA" || 
                input == "VSO" || 
                input == "VGE" || 
                input == "JCN" || 
                input == "JFC") {
            return "mdi-robot-industrial"
                }

            else if (
                input == "JET" ||
                input == "JMD" ||
                input == "JGE" ||
                input == "JAO" ||
                input == "JRT" ||
                input == "JST" ||
                input == "JBG" ||
                input == "JEC" ||
                input == "JCR" ||
                input == "JDE" ||
                input == "JFD" ||
                input == "JEJ" ||
                input == "JDT" ||
                input == "JBO" ||
                input == "JPO" ||
                input == "JRS" ||
                input == "EPS" ||
                input == "EDG" ||
                input == "EDE" ||
                input == "ESO" ||
                input == "ERE" ||
                input == "JEC" ||
                input == "JCC" ||
                input == "JRE ") {
            return "mdi-check-all"
                }
            
            else if (
                input == "VER" ||
                input == "EFT" ||
                input == "EGC") {
            return "mdi-alert-octagram"
            }

            else if (
                input == "IMA" ||
                input == "JBG" ||
                input == "JCO" ||
                input == "JEP" ||
                input == "JSC" ||
                input == "JCF" ||
                input == "JRC") {
            return "mdi-gesture-double-tap"
            }
        }

    }
}
