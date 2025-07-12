import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareStack as StackOverflow, Users, MessageSquare, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-orange-500 text-2xl mr-2">
                <StackOverflow className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-bold text-foreground">StackIt</h1>
            </div>
            <Button onClick={() => window.location.href = "/api/login"}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Knowledge Sharing
            <span className="text-orange-500 block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of developers, ask questions, share knowledge, and grow together. 
            StackIt is your minimal Q&A platform for collaborative learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              onClick={() => window.location.href = "/api/login"}
            >
              Join Community
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8"
              onClick={() => window.location.href = "/questions"}
            >
              Browse Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose StackIt?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Rich Text Editor</CardTitle>
                <CardDescription>
                  Write detailed questions and answers with our powerful editor supporting 
                  formatting, code blocks, images, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Voting System</CardTitle>
                <CardDescription>
                  Community-driven quality control through upvoting and downvoting. 
                  Question authors can accept the best answers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Structured community with guest viewers, active users, and admin moderators 
                  to maintain quality and order.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers sharing knowledge and solving problems together.
          </p>
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-orange-500 text-xl mr-2">
              <StackOverflow className="h-6 w-6" />
            </div>
            <span className="font-bold text-foreground">StackIt</span>
          </div>
          <p className="text-muted-foreground">
            A minimal Q&A platform for collaborative learning
          </p>
        </div>
      </footer>
    </div>
  );
}
