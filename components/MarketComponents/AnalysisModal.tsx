import React from 'react'

interface AnalysisModalProps {
    num: number,
}
export default function AnalysisModal({ num }: AnalysisModalProps) {
    return (
        <div>
            <span className="defi-primary-color" style={{ cursor: 'pointer' }}>{`${num}`}</span>
        </div>
    )
}
