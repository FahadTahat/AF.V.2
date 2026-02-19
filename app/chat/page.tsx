import { ChatInterface } from '@/components/chat-interface'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'المجتمعات والنقاشات | AF BTEC',
    description: 'شارك في النقاشات والتواصل مع زملائك في تخصصات BTEC المختلفة.',
}

export default function ChatPage() {
    return (
        <div className="relative h-screen pt-20 pb-4 flex flex-col overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
            </div>

            <div className="container mx-auto px-4 flex-1 flex flex-col min-h-0">
                <div className="mb-4 text-center space-y-1 flex-shrink-0">
                    <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                        مجتمع BTEC التفاعلي
                    </h1>
                </div>

                <div className="flex-1 min-h-0 w-full">
                    <ChatInterface />
                </div>
            </div>
        </div>
    )
}
