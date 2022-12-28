import { useMouse } from 'ahooks'
import { cloneDeep } from 'lodash'

import React, { FC, useRef, useState } from 'react'
import styled from 'styled-components'

import { primaryColorSystem } from '../style'

/**
 * FOButtonProps
 */
interface FOButtonProps {
    variant: 'text' | 'contained' | 'outlined'
}

const FOButton = styled.button<FOButtonProps>`
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: inline-block;
    color: ${(props) => (props.variant === 'contained' ? '#fff' : primaryColorSystem.FOBLUE)};
    padding: 9px 15px;
    /* background-color: #ffffff10; */
    background-color: ${(props) => {
        switch (props.variant) {
            case 'text':
                return '#ffffff10'
                break
            case 'contained':
                return primaryColorSystem.FOBLUE
                break
            case 'outlined':
                return '#ffffff10'
                break
            default:
                break
        }
    }};
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
    overflow: hidden;
    box-shadow: ${(props) => (props.variant === 'contained' ? '1px 1px 3px #7459e9' : 'none')};
    border-style: solid;
    box-sizing: border-box;
    border-width: 1px;
    border-color: ${(props) => {
        return props.variant === 'outlined' ? primaryColorSystem.FOBLUE : '#ffffff11'
    }};
    transition: all 0.4s ease;
    &:hover {
        background-color: ${(props) => {
            switch (props.variant) {
                case 'text':
                    return primaryColorSystem.FOBLUE + '1a'
                    break
                case 'contained':
                    return '#0a62bb'
                    break
                case 'outlined':
                    return primaryColorSystem.FOBLUE + '1a'
                    break

                default:
                    break
            }
        }};
    }

    .FOButton-root {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .rtr-ripple-wrapper-exiting {
        opacity: 0.5;
        animation: rtr-ripple-enter 0.8s ease-in-out;
        animation-fill-mode: forwards;
    }

    @keyframes rtr-ripple-enter {
        0% {
            transform: scale(0);
            opacity: 0.5;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`
/**
 * FOspan 涟漪气泡样式
 */
const FOspan = styled.span`
    position: absolute;
    top: 0px;
    left: 0px;
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: #62aae9;
    border-radius: 50%;
`

interface ButtonProps {
    children: string
    variant?: 'text' | 'contained' | 'outlined'
}

interface RippleArrayType {
    key: number
    Xy: {
        top: number

        left: number
    }
}

type RippleProps = Pick<RippleArrayType, 'Xy'>

/**
 * 涟漪气泡组件
 */
const Ripple: FC<RippleProps> = ({ Xy = { top: 0, left: 0 } }) => (
    <FOspan style={{ top: Xy.top, left: Xy.left }} className="rtr-ripple-wrapper-exiting"></FOspan>
)

const Button: FC<ButtonProps> = (props) => {
    const { children, variant = 'text' } = props
    const [rippleArray, setRippleArray] = useState<RippleArrayType[]>([])

    const ref = useRef<HTMLButtonElement>(null)
    const mouse = useMouse(ref.current)

    // 点击
    const click = () => {
        const newRipple = cloneDeep(rippleArray)
        if (newRipple && newRipple.length > 3) {
            newRipple.shift()
        }
        newRipple.push({
            key: +new Date(),
            Xy: {
                top: mouse.elementY - 50,
                left: mouse.elementX - 50
            }
        })
        setRippleArray(newRipple)
    }

    // 此处注意利用key值来区别开涟漪组件
    return (
        <FOButton onMouseDown={click} ref={ref} variant={variant}>
            {children}
            <span className="FOButton-root">
                {rippleArray.map((tit) => (
                    <Ripple key={tit.key} Xy={tit.Xy} />
                ))}
            </span>
        </FOButton>
    )
}

export default Button
