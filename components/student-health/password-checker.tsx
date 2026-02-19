"use client";

import { useState, useMemo } from "react";
import {
    Key,
    Eye,
    EyeOff,
    Info,
    CheckCircle2,
    XCircle,
    AlertTriangle,
} from "lucide-react";

export function PasswordChecker() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const analysis = useMemo(() => {
        if (!password) return null;

        const checks = [
            { label: "8 أحرف على الأقل", passed: password.length >= 8 },
            { label: "حرف كبير (A-Z)", passed: /[A-Z]/.test(password) },
            { label: "حرف صغير (a-z)", passed: /[a-z]/.test(password) },
            { label: "رقم (0-9)", passed: /[0-9]/.test(password) },
            { label: "رمز خاص (!@#$...)", passed: /[^A-Za-z0-9]/.test(password) },
            { label: "12 حرف أو أكثر (مستحسن)", passed: password.length >= 12 },
        ];

        const score = checks.filter((c) => c.passed).length;

        let strength: { label: string; color: string; bg: string; width: string };
        if (score <= 2) strength = { label: "ضعيفة جداً", color: "text-red-400", bg: "bg-red-500", width: "w-1/6" };
        else if (score <= 3) strength = { label: "ضعيفة", color: "text-orange-400", bg: "bg-orange-500", width: "w-2/6" };
        else if (score <= 4) strength = { label: "متوسطة", color: "text-yellow-400", bg: "bg-yellow-500", width: "w-3/6" };
        else if (score <= 5) strength = { label: "قوية", color: "text-blue-400", bg: "bg-blue-500", width: "w-4/6" };
        else strength = { label: "قوية جداً", color: "text-green-400", bg: "bg-green-500", width: "w-full" };

        const warnings: string[] = [];
        if (/^(123|abc|password|qwerty|111|000)/i.test(password)) warnings.push("تجنب الأنماط الشائعة مثل 123 أو abc أو password");
        if (/(.)\1{2,}/.test(password)) warnings.push("تجنب تكرار نفس الحرف أكثر من مرتين");
        if (/^[0-9]+$/.test(password)) warnings.push("لا تستخدم أرقام فقط");

        return { checks, score, strength, warnings };
    }, [password]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Key className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">فحص قوة كلمة المرور</h3>
                    <p className="text-sm text-slate-500">Password Strength Checker</p>
                </div>
            </div>

            <div className="relative mb-3">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور لفحصها..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all text-left"
                    dir="ltr"
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            <p className="text-xs text-slate-600 mb-5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                كلمة المرور لا يتم إرسالها أو تخزينها - الفحص يتم محلياً فقط
            </p>

            {analysis && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-400">القوة:</span>
                            <span className={`text-sm font-bold ${analysis.strength.color}`}>
                                {analysis.strength.label}
                            </span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${analysis.strength.bg} ${analysis.strength.width} rounded-full transition-all duration-500`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {analysis.checks.map((check, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                {check.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <span className={check.passed ? "text-green-400" : "text-slate-500"}>
                                    {check.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {analysis.warnings.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                            {analysis.warnings.map((w, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-amber-400">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    {w}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
