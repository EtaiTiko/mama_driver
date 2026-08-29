import { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  Badge,
  Alert,
  Spacer,
  LoadingSpinner,
  EmptyState,
} from "../components";

export default function ComponentShowcase() {
  const [input, setInput] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="pb-24">
      <Container>
        <div className="pt-6">
          <h1 className="text-3xl font-bold mb-2">Component Showcase</h1>
          <p className="text-gray-600 mb-6">Phase 2 - UI Component Library</p>

          {/* Buttons Section */}
          <Card>
            <CardHeader title="Buttons" />
            <CardBody>
              <div className="space-y-2">
                <Button variant="primary" fullWidth>
                  Primary Button
                </Button>
                <Button variant="secondary" fullWidth>
                  Secondary Button
                </Button>
                <Button variant="ghost" fullWidth>
                  Ghost Button
                </Button>
                <Button variant="danger" fullWidth>
                  Danger Button
                </Button>
                <Button loading fullWidth>
                  Loading
                </Button>
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Form Inputs */}
          <Card>
            <CardHeader title="Form Inputs" />
            <CardBody>
              <div className="space-y-4">
                <Input
                  label="Text Input"
                  placeholder="Type something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Input
                  label="With Error"
                  placeholder="This field has an error"
                  error="This is required"
                />
                <Select
                  label="Dropdown Select"
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                />
                <Textarea
                  label="Textarea"
                  placeholder="Type a longer message..."
                  rows={4}
                />
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Badges */}
          <Card>
            <CardHeader title="Badges" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Error</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="default">Default</Badge>
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Alerts */}
          <Card>
            <CardHeader title="Alerts" />
            <CardBody>
              <div className="space-y-3">
                {showAlert && (
                  <Alert
                    type="info"
                    title="Information"
                    onClose={() => setShowAlert(false)}
                  >
                    This is an informational alert message.
                  </Alert>
                )}
                <Alert type="success" title="Success">
                  Operation completed successfully!
                </Alert>
                <Alert type="warning" title="Warning">
                  Please be careful with this action.
                </Alert>
                <Alert type="error" title="Error">
                  Something went wrong. Please try again.
                </Alert>
              </div>
            </CardBody>
          </Card>

          <Spacer size="md" />

          {/* Loading & Empty States */}
          <Card>
            <CardHeader title="Loading States" />
            <CardBody>
              <LoadingSpinner message="Loading content..." />
            </CardBody>
          </Card>

          <Spacer size="md" />

          <Card>
            <CardHeader title="Empty State" />
            <CardBody>
              <EmptyState
                icon="📭"
                title="No Items"
                message="There are currently no items to display."
              />
            </CardBody>
          </Card>

          <Spacer size="lg" />

          {/* Layout Examples */}
          <Card>
            <CardHeader title="Touch-Optimized Layout" />
            <CardBody>
              <p className="text-sm text-gray-600 mb-4">
                All interactive elements have a minimum 48px touch target for
                mobile usability.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded text-sm">
                  Button height: 3rem (48px)
                </div>
                <div className="p-4 bg-blue-50 rounded text-sm">
                  Input height: 3rem (48px)
                </div>
              </div>
            </CardBody>
          </Card>

          <Spacer size="lg" />
        </div>
      </Container>
    </div>
  );
}
