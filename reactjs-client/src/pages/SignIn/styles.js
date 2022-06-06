import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    div{
        display: flex;
        flex-flow: column nowrap;
        padding: 16px;
        background-color:rgba(255, 255, 255, 1);
        border-radius: 8px;
        border: 1px solid rgba(219, 219, 219, 1);
        min-width: 300px;

        h2{
            text-align: center;
            margin-bottom: 16px;
            color: #242424;
        }

        form{
            display: flex;
            flex-flow: column nowrap;

            input{
                margin-top: 8px;
                line-height: 32px;
                font-size: 12px;
                background-color: rgba(250, 250, 250, 1);
                border: 1px solid rgba(219, 219, 219, 1);
                border-radius: 4px;
                padding: 0 8px;
            }
            span{
                margin-top: 2px;
            }

            button{
                margin: 16px auto 0 auto;
                min-width: 120px;
                line-height: 32px;
                font-size: 12px;
                background-color: #1565c0;
                color: #fff;
                font-weight: 700;
                font-size: 14px;
                border: none;
                border-radius: 4px;
            }
        }

        a{
            display: inline-block;
            margin: 16px auto 0 auto;
            font-size: 12px;
            text-decoration: none;
        }


        .error-span{
            color: red;
            font-size: 12px;
        }
    }
`;
