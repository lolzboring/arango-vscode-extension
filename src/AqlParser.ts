export class AqlParser {
    variables: {[key: string]: string} = {};
    query: string;
    raw: string;

    private _queryStr: string = '';
    private _variableStr: string = '';

    constructor(str: string) {
        this.raw = str;

        this._variableStr = '';
        this._queryStr = this.removeComment(this.raw);

        this.variables = {};

        if (this.hasSeparator(this._queryStr)) {
            let arr = this.split(this._queryStr);
            this._variableStr = arr[0];
            this._queryStr = arr[1];
        } else {
            this._variableStr = this._queryStr;
        }

        if (this.hasVariable(this._variableStr)) {
            this.variables = this.extractVariable(this._variableStr);
            // in case no separator
            this._queryStr = this.trimVariableDeclaration(this._queryStr);
            this._queryStr = this.injectVariable(this._queryStr, this.variables);
        }
        this.query = this.trim(this._queryStr);
    }

    hasSeparator(str: string) {
        let regex = /-{3,}/g;
        return regex.test(str);
    }

    hasVariable(str: string) {
        let regex = /@\w+/g;
        return regex.test(str);
    }

    removeComment(str: string) {
        return str.replace(/\/\/.*/g, '');
    }

    // just in case no separator
    trimVariableDeclaration(str: string) {
        return str.replace(/@\w+ *=.*/g, '');
    }

    trim(str: string) {
        return str.replace(/[\r\n\t]/g, ' ')
                    .replace(/ {1,}/gm, ' ');
    }

    extractVariable(str: string) {
        let variables: {[key:string]: any} = {};
        let varRegExp = /(@\w+)=(.+)/gm;
        
        let varArr = str.split(varRegExp);
        for (let i=0; i<varArr.length; i+=3) {
            let variable = varArr[i+1];
            let value = varArr[i+2];
            if (!variable || !value) {
                continue;
            }
            variables[variable] = value;
        }	
        return variables;
    }

    private split(str: string) {
        const separator = /-{3,}/g;
    	return str.split(separator);
    }

    injectVariable(text: string, variables: {[key: string]: string}) {
        for (let variable in variables) {
            if (this.isArray(variables[variable]) || this.isObject(variables[variable])) {
                text = text.replace(variable, variables[variable]);
            } else {
                text = text.replace(variable, '\'' + variables[variable] + '\'');
            }
        }
        return text;
    }

    

    private isArray(str: string) {
        if (str) {
            return str.charAt(0) === '[';
        }
        return false;
    }

    private isObject(str: string) {
        if (str) {
            return str.charAt(0) === '{';
        }
        return false;
    }

}